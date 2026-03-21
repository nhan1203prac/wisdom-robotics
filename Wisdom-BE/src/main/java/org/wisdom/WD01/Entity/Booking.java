package org.wisdom.WD01.Entity;

import jakarta.persistence.*;
import lombok.Data;
import org.wisdom.WD01.Enum.BookingCrmStatus;
import org.wisdom.WD01.Enum.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ với khách hàng và dịch vụ
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceEntity service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id")
    private ServicePackage servicePackage;

    // Thời gian đặt lịch
    private LocalDate bookingDate;

    @ManyToOne
    @JoinColumn(name = "slot_id")
    private BookingSlot slot;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    // Thông tin doanh nghiệp & dự án (Yêu cầu số 5)
    private String fullName;
    private String phoneNumber;
    private String email;
    private String companyName;
    private String currentWebsite;
    private String projectDescription;
    private BigDecimal expectedBudget;
    private String implementationTime;

    private BigDecimal totalAmount;
    private BigDecimal depositAmount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
    private String paymentMethod; // VNPAY, MOMO, STRIPE

    // Loại hình & Phân công
    private String meetingType; // ONLINE, OFFLINE
    private String meetingLink; // Google Meet/Zoom link

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee assignedEmployee;

    @Enumerated(EnumType.STRING)
    @Column(name = "crm_status")
    private BookingCrmStatus crmStatus = BookingCrmStatus.NEW_LEAD;

    private LocalDateTime createdAt = LocalDateTime.now();
}