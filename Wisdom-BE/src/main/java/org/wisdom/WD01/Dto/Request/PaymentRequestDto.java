package org.wisdom.WD01.Dto.Request;

import lombok.Data;
import org.wisdom.WD01.Enum.TargetType;

@Data
public class PaymentRequestDto {
    private TargetType targetType; // ORDER, APPOINTMENT
    private Long targetId;
    private Long amount;
    private String provider;      // VNPAY / MOMO
}
