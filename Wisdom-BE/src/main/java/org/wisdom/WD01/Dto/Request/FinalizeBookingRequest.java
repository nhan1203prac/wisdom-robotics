package org.wisdom.WD01.Dto.Request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FinalizeBookingRequest {
    // Thông tin khách hàng & Doanh nghiệp
    private String fullName;
    private String phoneNumber;
    private String email;
    private String companyName;
    private String currentWebsite;
    private String paymentMethod; // "VNPAY", "MOMO"

    // Thông tin dự án
    private String projectDescription;
    private BigDecimal expectedBudget;
    private String implementationTime;

    private String meetingType; // ONLINE hoặc OFFLINE
}