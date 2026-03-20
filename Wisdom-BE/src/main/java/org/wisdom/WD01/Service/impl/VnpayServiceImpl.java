package org.wisdom.WD01.Service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.wisdom.WD01.Entity.PaymentTransaction;
import org.wisdom.WD01.Enum.PaymentStatus;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Service.PaymentService;
import org.wisdom.WD01.Util.HashUtil;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component("VNPAY")
public class VnpayServiceImpl implements PaymentService {

    @Value("${payment.vnpay.url}")
    private String VNP_URL;

    @Value("${payment.vnpay.hash-secret}")
    private String VNP_HASH_SECRET;

    @Value("${payment.vnpay.tmn-code}")
    private String VNP_TMN_CODE;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String createPaymentUrl(PaymentTransaction transaction, String returnUrl) {
        // 1. Format current date for VNPAY requirement (yyyyMMddHHmmss)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String vnp_CreateDate = LocalDateTime.now().format(formatter);

        // 2. Prepare mandatory parameters for VNPAY payment request
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", VNP_TMN_CODE);
        vnp_Params.put("vnp_Amount", String.valueOf(transaction.getAmount() * 100)); // VNPAY uses VND * 100
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", transaction.getTxRef());
        vnp_Params.put("vnp_OrderInfo", "Thanh toan giao dich: " + transaction.getTxRef());
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", "127.0.0.1");
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        // 3. Sort parameters alphabetically (Strict VNPAY requirement)
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        // 4. Build Hash data string and Query string simultaneously
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                // Encode and append to Hash string
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                // Encode and append to Query string
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII)).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));

                if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        // 5. Generate SecureHash (HmacSHA512) for data integrity
        String vnp_SecureHash = HashUtil.hmacHashing("HmacSHA512", VNP_HASH_SECRET, hashData.toString());

        // 6. Return final VNPAY URL with all parameters and signature
        return VNP_URL + "?" + query.toString() + "&vnp_SecureHash=" + vnp_SecureHash;
    }

    @Override
    public boolean verifySignature(Map<String, String> params) {
        // 1. Get incoming signature from VNPAY callback
        String vnp_SecureHash = params.get("vnp_SecureHash");

        // 2. Clean parameters for recalculation (remove existing hashes)
        Map<String, String> vnp_Params = new HashMap<>(params);
        vnp_Params.remove("vnp_SecureHashType");
        vnp_Params.remove("vnp_SecureHash");

        // 3. Sort parameters again
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        // 4. Rebuild the hash data string
        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (!fieldName.equals(fieldNames.get(fieldNames.size() - 1))) {
                    hashData.append('&');
                }
            }
        }

        // 5. Compare re-calculated hash with VNPAY's signature
        String checkHash = HashUtil.hmacHashing("HmacSHA512", VNP_HASH_SECRET, hashData.toString());
        return checkHash.equalsIgnoreCase(vnp_SecureHash);
    }

    @Override
    public PaymentStatus getStatus(Map<String, String> params) {
        // VNPAY response code "00" indicates success
        return "00".equals(params.get("vnp_ResponseCode")) ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
    }

    @Override
    public String refund(PaymentTransaction transaction) {
        try {
            // 1. Prepare unique request ID and timestamps
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            String vnp_RequestId = UUID.randomUUID().toString().replace("-", "");

            long amountVal = transaction.getAmount() * 100;
            String amountStr = String.valueOf(amountVal);
            long txnNo = Long.parseLong(transaction.getGatewayTransactionNo());

            String vnp_TransactionDate = transaction.getCreatedAt().format(formatter);
            String vnp_CreateDate = LocalDateTime.now().format(formatter);
            String vnp_IpAddr = "127.0.0.1";
            String vnp_OrderInfo = "Refund Order " + transaction.getTargetId();

            // 2. Create raw hash data using VNPAY's specific pipe-separated format for Refund API
            String hashData = vnp_RequestId + "|2.1.0|refund|" + VNP_TMN_CODE + "|02|" +
                    transaction.getTxRef() + "|" + amountStr + "|" + txnNo + "|" +
                    vnp_TransactionDate + "|Admin_System|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;

            // 3. Sign the refund data
            String vnp_SecureHash = HashUtil.hmacHashing("HmacSHA512", VNP_HASH_SECRET, hashData.toString());

            // 4. Construct LinkedHashMap to maintain parameter order in JSON request
            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("vnp_RequestId", vnp_RequestId);
            requestBody.put("vnp_Version", "2.1.0");
            requestBody.put("vnp_Command", "refund"); // Command for refunding
            requestBody.put("vnp_TmnCode", VNP_TMN_CODE);
            requestBody.put("vnp_TransactionType", "02"); // 02: Full Refund
            requestBody.put("vnp_TxnRef", transaction.getTxRef());
            requestBody.put("vnp_Amount", amountVal);
            requestBody.put("vnp_OrderInfo", vnp_OrderInfo);
            requestBody.put("vnp_TransactionNo", txnNo);
            requestBody.put("vnp_TransactionDate", vnp_TransactionDate);
            requestBody.put("vnp_CreateDate", vnp_CreateDate);
            requestBody.put("vnp_CreateBy", "Admin_System");
            requestBody.put("vnp_IpAddr", vnp_IpAddr);
            requestBody.put("vnp_SecureHash", vnp_SecureHash);

            // 5. Call VNPAY Merchant Web API for refund processing
            String vnp_ApiUrl = "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction";
            Map<String, Object> response = restTemplate.postForObject(vnp_ApiUrl, requestBody, Map.class);

            if (response != null) {
                String resCode = String.valueOf(response.get("vnp_ResponseCode"));
                if ("00".equals(resCode)) {
                    return "VNPay Refund successful";
                }
                throw new AppException("VNPay Refund Error: " + response.get("vnp_Message") + " (" + resCode + ")");
            }
            throw new AppException("No response from VNPay");
        } catch(Exception e) {
            throw new AppException("Refund VNPay Error: " + e.getMessage());
        }
    }


}