package org.wisdom.WD01.Dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
@Data
public class ServiceResponseDto {

    private Long serviceId;
    private String serviceName;
    private String description;
    private BigDecimal basePrice;
    private BigDecimal ratingAvg;      // ← PHẢI là BigDecimal (khớp entity)
    private Integer ratingCount;
    private Instant createdAt;         // ← Instant
    private String thumbnail;
    private Integer viewCount;
    private Integer searchCount;

    private CompanySimpleDto company;

    @Data
    public static class CompanySimpleDto {
        private Long companyId;
        private String companyName;
    }
}