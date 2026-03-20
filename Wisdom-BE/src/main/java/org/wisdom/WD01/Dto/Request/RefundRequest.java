package org.wisdom.WD01.Dto.Request;

import lombok.Data;
import org.wisdom.WD01.Enum.TargetType;

@Data
public class RefundRequest {
    private Long targetId;
    private TargetType targetType;
    private String reason;
}
