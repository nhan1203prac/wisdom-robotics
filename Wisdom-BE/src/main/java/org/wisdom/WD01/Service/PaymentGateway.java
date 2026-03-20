package org.wisdom.WD01.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wisdom.WD01.Entity.PaymentTransaction;
import org.wisdom.WD01.Enum.PaymentStatus;
import org.wisdom.WD01.Enum.TargetType;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Reponsitory.PaymentTransactionRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentGateway {
    private final Map<String, PaymentService> gateways;
    private final PaymentTransactionRepository paymentRepository;

    @Transactional
    public String create(TargetType type, Long targetId, Long amount, String provider) {
        // TODO: Verify targetId before proceeding
        // 1. Check if the Order/Appointment exists in their respective tables
        // 2. Ensure the amount matches the record in the database
        // 3. Confirm the status is still 'UNPAID' to prevent double payment

        // Create a unique transaction reference (txRef)
        String txRef = provider.toUpperCase() + "_" + System.currentTimeMillis() + "_" + targetId;

        // Save initial transaction data to Database
        PaymentTransaction tx = new PaymentTransaction();
        tx.setTxRef(txRef);
        tx.setTargetId(targetId);
        tx.setTargetType(type);
        tx.setAmount(amount);
        tx.setProvider(provider.toUpperCase());
        tx.setStatus(PaymentStatus.PENDING);

        // Save record before redirecting user to the payment gateway
        paymentRepository.save(tx);

        // Get the specific Payment Gateway from Map (Strategy Pattern)
        PaymentService gateway = gateways.get(provider.toUpperCase());
        if (gateway == null) throw new RuntimeException("Cổng thanh toán " + provider + " không hỗ trợ");

        // Generate payment URL using txRef (not the database ID)
        return gateway.createPaymentUrl(tx, "http://localhost:8080/api/payment/callback/" + provider.toLowerCase());
    }

    @Transactional
    public PaymentTransaction processCallback(String provider, Map<String, String> params) {
        PaymentService gateway = gateways.get(provider.toUpperCase());
        if (gateway == null) throw new AppException("Payment provider [" + provider + "] is not supported.");

        // Verify the digital signature for security
        if (!gateway.verifySignature(params)) {
            throw new AppException("Security violation: Invalid transaction signature.");
        }

        // Find the transaction in DB using the returned reference (txRef)
        // VNPAY uses 'vnp_TxnRef', MoMo uses 'orderId'
        String txRef = params.getOrDefault("vnp_TxnRef", params.get("requestId"));

        PaymentTransaction tx = paymentRepository.findByTxRef(txRef)
                .orElseThrow(() -> new AppException("Transaction not found with reference: " + txRef));

        // Idempotency check: Don't process if already successful
        if (tx.getStatus() == PaymentStatus.SUCCESS) {
            return tx;
        }

        // Update transaction status and details from Gateway
        PaymentStatus newStatus = gateway.getStatus(params);
        tx.setStatus(newStatus);

        // Save the Provider's internal transaction ID for reconciliation
        tx.setGatewayTransactionNo(params.getOrDefault("vnp_TransactionNo", params.get("transId")));
        tx.setRawCallbackData(params.toString());

        if ("VNPAY".equalsIgnoreCase(provider) && params.containsKey("vnp_PayDate")) {
            String vnpPayDate = params.get("vnp_PayDate"); // yyyyMMddHHmmss
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
            tx.setCreatedAt(LocalDateTime.parse(vnpPayDate, formatter));
        } else {

            tx.setCreatedAt(LocalDateTime.now());
        }

        paymentRepository.save(tx);

        // Execute business logic only if payment is successful
        if (newStatus == PaymentStatus.SUCCESS) {
            updateBusinessLogic(tx, "PAID");
        }

        return tx;
    }

    @Transactional
    public void refundRequest(Long targetId, TargetType type, String reason){
        PaymentTransaction tx = paymentRepository
                .findByTargetIdAndTargetTypeAndStatus(targetId, type, PaymentStatus.SUCCESS)
                .orElseThrow(() -> new AppException("Transaction not found"));
        if (tx.getStatus() == PaymentStatus.REFUND_PENDING || tx.getStatus() == PaymentStatus.REFUNDED) {
            throw new AppException("The transaction had previously been requested for a refund");
        }
        tx.setStatus(PaymentStatus.REFUND_PENDING);
        tx.setRefundReason(reason);

        paymentRepository.save(tx);
    }

    @Transactional
    public String approveRefund(Long transactionId){
        PaymentTransaction tx = paymentRepository.findById(transactionId)
                .orElseThrow(() -> new AppException("Transaction not found"));

        if(tx.getStatus() != PaymentStatus.REFUND_PENDING){
            throw new AppException("Transaction is not refunding.");
        }

        PaymentService gateway = gateways.get(tx.getProvider().toUpperCase());

        try {
            String result = gateway.refund(tx);
            tx.setStatus(PaymentStatus.REFUNDED);
            updateBusinessLogic(tx, "REFUNDED");

            paymentRepository.save(tx);
            return result;
        }catch (Exception e){
            tx.setStatus(PaymentStatus.REFUND_ERROR);
            paymentRepository.save(tx);
            throw new AppException("Lỗi API Refund: " + e.getMessage());
        }
    }


    private void updateBusinessLogic(PaymentTransaction tx, String status) {
        System.out.println("Cập nhật " + tx.getTargetType() + " ID " + tx.getTargetId() + " sang trạng thái: " + status);

        /* if (tx.getTargetType() == TargetType.ORDER) {
            orderService.updateStatus(tx.getTargetId(), status);
        } else if (tx.getTargetType() == TargetType.APPOINTMENT) {
            appointmentService.updateStatus(tx.getTargetId(), status);
        }
        */
    }

}