package org.wisdom.WD01.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.Request.ApproveRefundRequest;
import org.wisdom.WD01.Dto.Request.PaymentRequestDto;
import org.wisdom.WD01.Dto.Request.RefundRequest;
import org.wisdom.WD01.Dto.Response.ApiResponse;
import org.wisdom.WD01.Entity.PaymentTransaction;
import org.wisdom.WD01.Enum.PaymentStatus;
import org.wisdom.WD01.Service.PaymentGateway;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentGateway paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<String>> initiatePayment(@RequestBody PaymentRequestDto request) {
        try {
            String paymentUrl = paymentService.create(
                    request.getTargetType(),
                    request.getTargetId(),
                    request.getAmount(),
                    request.getProvider()
            );

            return ResponseEntity.ok(
                    ApiResponse.<String>builder()
                            .success(true)
                            .message("Create payment successful")
                            .data(paymentUrl)
                            .build()
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.<String>builder()
                            .success(false)
                            .message("Invalid data: " + e.getMessage())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<String>builder()
                            .success(false)
                            .message("System error: " + e.getMessage())
                            .build()
            );
        }
    }

    @GetMapping("/callback/{provider}")
    public ResponseEntity<ApiResponse<PaymentTransaction>> handleCallback(
            @PathVariable String provider,
            @RequestParam Map<String, String> allParams) {

        try {
            PaymentTransaction transaction = paymentService.processCallback(provider, allParams);

            if (transaction.getStatus() == PaymentStatus.SUCCESS) {
                return ResponseEntity.ok(
                        ApiResponse.<PaymentTransaction>builder()
                                .success(true)
                                .message("Payment successful!")
                                .data(transaction)
                                .build()
                );
            } else {
                return ResponseEntity.ok(
                        ApiResponse.<PaymentTransaction>builder()
                                .success(false)
                                .message("Payment failed or cancelled!.")
                                .data(transaction)
                                .build()
                );
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(
                    ApiResponse.<PaymentTransaction>builder()
                            .success(false)
                            .message("Handle result failed: " + e.getMessage())
                            .build()
            );
        }
    }

    @PostMapping("/refund-request")
    public ResponseEntity<ApiResponse> requestRefund(@RequestBody RefundRequest dto) {
        paymentService.refundRequest(
                dto.getTargetId(),
                dto.getTargetType(),
                dto.getReason()
        );
        return ResponseEntity.ok(new ApiResponse(true, "Refund request sent, Please wait for admin approved.", null));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/approve-refund")
    public ResponseEntity<ApiResponse> approveRefund(@RequestBody ApproveRefundRequest dto) {
        String result = paymentService.approveRefund(dto.getTransactionId());
        return ResponseEntity.ok(new ApiResponse(true, result, null));
    }
}
