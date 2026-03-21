package org.wisdom.WD01.Dto.Request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long userId;
    private Long serviceId;
    private Long packageId;
    private Long slotId;
    private LocalDate bookingDate;

    // Thông tin khách hàng & Doanh nghiệp
    private String fullName;
    private String phoneNumber;
    private String email;
    private String companyName;
    private String currentWebsite;

    // Thông tin dự án
    private String projectDescription;
    private BigDecimal expectedBudget;
    private String implementationTime;

    // Loại hình cuộc hẹn
    private String meetingType; // "ONLINE" hoặc "OFFLINE"
}