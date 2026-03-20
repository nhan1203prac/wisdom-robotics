package org.wisdom.WD01.Entity;

import jakarta.persistence.*;
import lombok.Data;
import org.wisdom.WD01.Enum.PaymentStatus;
import org.wisdom.WD01.Enum.TargetType;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "payment_transaction")
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "transaction_id")
    private Long id;
    @Column(unique = true)
    private String txRef; // Mã tham chiếu gửi cho Gateway
    private Long targetId;      // ID của Order/Appointment

    @Enumerated(EnumType.STRING)
    private TargetType targetType;
    private Long amount;
    private String provider;      // VNPAY / MOMO

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    private String description;
    private String refundReason;
    private LocalDateTime createdAt;

    private String gatewayTransactionNo;

    @Column(columnDefinition = "TEXT")
    private String rawCallbackData;
}
