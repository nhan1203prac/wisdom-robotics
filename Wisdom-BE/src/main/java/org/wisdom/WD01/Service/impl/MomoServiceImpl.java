package org.wisdom.WD01.Service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.wisdom.WD01.Entity.PaymentTransaction;
import org.wisdom.WD01.Enum.PaymentStatus;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Service.PaymentService;
import org.wisdom.WD01.Util.HashUtil;


import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component("MOMO")
public class MomoServiceImpl implements PaymentService {

    @Value("${payment.momo.url}")
    private String MOMO_URL;

    @Value("${payment.momo.partner-code}")
    private String PARTNER_CODE;

    @Value("${payment.momo.access-key}")
    private String ACCESS_KEY;

    @Value("${payment.momo.secret-key}")
    private String SECRET_KEY;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String createPaymentUrl(PaymentTransaction transaction, String returnUrl) {
        try {
            // 1. Prepare MoMo request parameters
            String orderId = transaction.getTargetType() + "_" + transaction.getTargetId() + "_" + System.currentTimeMillis();
            String requestId = transaction.getTxRef();
            String amount = String.valueOf(transaction.getAmount());
            String orderInfo = "Thanh-toan-don-hang-" + transaction.getTargetId();
            String requestType = "payWithMethod";
            String extraData = "";

            // 2. Build raw string for HMAC SHA256 signature (MoMo security requirement)
            String rawHash = "accessKey=" + ACCESS_KEY +
                    "&amount=" + amount +
                    "&extraData=" + extraData +
                    "&ipnUrl=" + returnUrl +
                    "&orderId=" + orderId +
                    "&orderInfo=" + orderInfo +
                    "&partnerCode=" + PARTNER_CODE +
                    "&redirectUrl=" + returnUrl +
                    "&requestId=" + requestId +
                    "&requestType=" + requestType;

            String signature = HashUtil.hmacHashing("HmacSHA256", SECRET_KEY, rawHash);

            // 3. Construct JSON request body for MoMo API
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", PARTNER_CODE);
            requestBody.put("accessKey", ACCESS_KEY);
            requestBody.put("requestId", requestId);
            requestBody.put("amount", amount);
            requestBody.put("orderId", orderId);
            requestBody.put("orderInfo", orderInfo);
            requestBody.put("redirectUrl", returnUrl);
            requestBody.put("ipnUrl", returnUrl);
            requestBody.put("extraData", extraData);
            requestBody.put("requestType", requestType);
            requestBody.put("signature", signature);
            requestBody.put("lang", "vi");

            // 4. Send POST request to MoMo gateway
            Map<String, Object> response = restTemplate.postForObject(MOMO_URL, requestBody, Map.class);

            // 5. Get and return payment URL if success
            if (response != null && response.get("payUrl") != null) {
                return response.get("payUrl").toString();
            }

            throw new AppException("MoMo Error: " + (response != null ? response.get("message") : "No response"));

        } catch (Exception e) {
            throw new AppException("Lỗi khởi tạo MoMo: " + e.getMessage());
        }
    }

    @Override
    public boolean verifySignature(Map<String, String> params) {
        // Verify incoming signature from MoMo callback
        String mSignature = params.get("signature");
        if (mSignature == null) return false;

        // Re-calculate hash using callback parameters
        String rawHash = "accessKey=" + ACCESS_KEY +
                "&amount=" + params.get("amount") +
                "&extraData=" + params.getOrDefault("extraData", "") +
                "&message=" + params.get("message") +
                "&orderId=" + params.get("orderId") +
                "&orderInfo=" + params.get("orderInfo") +
                "&orderType=" + params.get("orderType") +
                "&partnerCode=" + params.get("partnerCode") +
                "&payType=" + params.get("payType") +
                "&requestId=" + params.get("requestId") +
                "&responseTime=" + params.get("responseTime") +
                "&resultCode=" + params.get("resultCode") +
                "&transId=" + params.get("transId");

        String mySignature = HashUtil.hmacHashing("HmacSHA256", SECRET_KEY, rawHash);
        return mySignature.equals(mSignature);
    }

    @Override
    public PaymentStatus getStatus(Map<String, String> params) {
        // MoMo resultCode 0 means success
        String res = String.valueOf(params.get("resultCode"));
        return "0".equals(res) ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
    }

    @Override
    public String refund(PaymentTransaction transaction) {
        try {
            // 1. Prepare refund parameters
            String requestId = UUID.randomUUID().toString();
            String orderId = "REF_" + System.currentTimeMillis() + "_" + transaction.getTargetId();
            String transId = transaction.getGatewayTransactionNo();
            String description = transaction.getRefundReason() != null ?
                    transaction.getRefundReason()
                    : "Hoan tien giao dich " + transaction.getTxRef();

            // 2. Sign the refund request
            String rawHash = "accessKey=" + ACCESS_KEY +
                    "&amount=" + transaction.getAmount() +
                    "&description=" + description +
                    "&orderId=" + orderId +
                    "&partnerCode=" + PARTNER_CODE +
                    "&requestId=" + requestId +
                    "&transId=" + transId;

            String signature = HashUtil.hmacHashing("HmacSHA256", SECRET_KEY, rawHash);

            // 3. Handle data types for MoMo API
            long transIdLong;
            try {
                transIdLong = Long.parseLong(transId);
            } catch (NumberFormatException e) {
                throw new AppException("Invalid transId: " + transId);
            }

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("partnerCode", PARTNER_CODE);
            requestBody.put("requestId", requestId);
            requestBody.put("amount", transaction.getAmount());
            requestBody.put("orderId", orderId);
            requestBody.put("transId", transIdLong);
            requestBody.put("description", description);
            requestBody.put("signature", signature);
            requestBody.put("lang", "vi");

            // 4. Send refund request to MoMo refund endpoint
            String refundUrl = MOMO_URL.replace("/create", "/refund");

            Map<String, Object> response = restTemplate.postForObject(refundUrl, requestBody, Map.class);
            if (response != null && "0".equals(String.valueOf(response.get("resultCode")))) {
                return "Hoàn tiền thành công. Mã GD MoMo: " + response.get("transId");
            }

            String errorMsg = (response != null) ? (String) response.get("message") : "Không có phản hồi từ MoMo";
            throw new AppException("MoMo Refund Error: " + errorMsg);
        } catch (Exception e) {
            throw new AppException("Refund Error: " + e.getMessage());
        }
    }


}