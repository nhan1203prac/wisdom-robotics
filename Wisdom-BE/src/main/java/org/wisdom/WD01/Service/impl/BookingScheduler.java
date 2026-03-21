package org.wisdom.WD01.Service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.wisdom.WD01.Entity.Booking;
import org.wisdom.WD01.Entity.BookingSlot;
import org.wisdom.WD01.Enum.BookingCrmStatus;
import org.wisdom.WD01.Enum.PaymentStatus;
import org.wisdom.WD01.Reponsitory.BookingRepository;
import org.wisdom.WD01.Reponsitory.BookingSlotRepository;
import org.wisdom.WD01.Service.EmailService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingScheduler {

    private final BookingRepository bookingRepo;
    private final EmailService emailService;
    private final BookingSlotRepository bookingSlotRepository;

    // Giải phóng Slot sau 5 phút nếu không thanh toán
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredBookings() {
        LocalDateTime limit = LocalDateTime.now().minusMinutes(10);
        List<Booking> expiredBookings = bookingRepo.findByPaymentStatusAndCreatedAtBefore(PaymentStatus.PENDING, limit);

        if (!expiredBookings.isEmpty()) {
            for (Booking booking : expiredBookings) {
                booking.setPaymentStatus(PaymentStatus.CANCELLED);
                booking.setCrmStatus(BookingCrmStatus.DEAL_LOST);
            }
            bookingRepo.saveAll(expiredBookings);
            log.info("Đã giải phóng {} slot hết hạn thanh toán", expiredBookings.size());
        }
    }

    // TẠO SLOT MỖI NGÀY LÚC 0H
    @Scheduled(cron = "0 0 0 * * ?")
    public void autoGenerateSlots() {
        // Tự động tạo cho 7 ngày tới để khách luôn có lịch để đặt
        for (int i = 1; i <= 7; i++) {
            LocalDate targetDate = LocalDate.now().plusDays(i);
            generateSlotsForDate(targetDate, "08:00", "12:00"); // Ca sáng
            generateSlotsForDate(targetDate, "13:30", "17:30"); // Ca chiều
        }
        System.out.println(">>> [Scheduler] Đã tự động cập nhật Slot cho 7 ngày tới.");
    }



    // Nhắc lịch tự động trước 24h và 2h
    @Scheduled(fixedRate = 1800000) // Chạy mỗi 30 phút
    public void sendMeetingReminders() {
        LocalDateTime now = LocalDateTime.now();

        // Nhắc trước 24h
        checkAndSend(now.plusDays(1), "Nhắc hẹn: Bạn có lịch tư vấn vào ngày mai");

        // Nhắc trước 2h
        checkAndSend(now.plusHours(2), "Nhắc hẹn: Lịch tư vấn của bạn sẽ bắt đầu sau 2 giờ nữa");
    }

    // Xóa bản ghi trạng thái CANCELLED_TIMEOUT sau 1 tháng
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void cleanOldData() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        // Xóa các lịch hẹn hết hạn hoặc bị hủy từ 1 tháng trước để nhẹ máy chủ
        bookingRepo.deleteByCrmStatusAndCreatedAtBefore(BookingCrmStatus.DEAL_LOST, oneMonthAgo);
        log.info("Đã dọn dẹp dữ liệu đặt lịch cũ để tối ưu bộ nhớ.");
    }

    // FUNC NHẮC NHỞ VIỆC PHỎNG VẤN
    private void checkAndSend(LocalDateTime targetTime, String subject) {
        // Tìm các lịch hẹn có giờ bắt đầu trùng với khung giờ mục tiêu
        LocalDate date = targetTime.toLocalDate();
        LocalTime startRange = targetTime.toLocalTime().minusMinutes(15);
        LocalTime endRange = targetTime.toLocalTime().plusMinutes(15);

        List<Booking> bookings = bookingRepo.findBookingsToRemind(date, startRange, endRange);

        for (Booking b : bookings) {
            String content = String.format(
                    "Xin chào %s, đây là tin nhắn nhắc nhở về buổi hẹn '%s' vào lúc %s ngày %s. " +
                            "Hình thức: %s. Trân trọng!",
                    b.getFullName(), b.getService().getServiceName(),
                    b.getSlot().getStartTime(), b.getBookingDate(), b.getMeetingType()
            );

            try {
                emailService.sendEmail(b.getEmail(), subject, content);
                log.info("Đã gửi nhắc hẹn cho Booking ID: {}", b.getId());
            } catch (Exception e) {
                log.error("Lỗi gửi nhắc hẹn cho ID {}: {}", b.getId(), e.getMessage());
            }
        }



    }
    // FUNC TẠO SLOT BOOKING
    private void generateSlotsForDate(LocalDate date, String startTime, String endTime) {
        LocalTime start = LocalTime.parse(startTime);
        LocalTime end = LocalTime.parse(endTime);

        while (start.isBefore(end)) {
            LocalTime next = start.plusMinutes(30);
            if (!bookingSlotRepository.existsByDateAndStartTimeAndEndTime(date, start, next)) {
                BookingSlot slot = new BookingSlot();
                slot.setDate(date);
                slot.setStartTime(start);
                slot.setEndTime(next);
                slot.setIsActive(true);
                slot.setMaxCapacity(1);
                bookingSlotRepository.save(slot);
            }
            start = next;
        }
    }
}