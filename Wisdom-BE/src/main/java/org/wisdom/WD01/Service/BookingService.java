package org.wisdom.WD01.Service;

import org.wisdom.WD01.Dto.Request.BookingRequest;
import org.wisdom.WD01.Dto.Request.FinalizeBookingRequest;
import org.wisdom.WD01.Entity.Booking;
import org.wisdom.WD01.Entity.BookingSlot;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingService {

    // Lấy danh sách các slot còn trống cho một ngày cụ thể
    List<LocalTime> getAvailableStartTimes(Long serviceId, LocalDate date);

    Booking confirmBooking(Long bookingId);
    // Phân công nhân viên tự động dựa trên kỹ năng và lịch rảnh
    void autoAssignEmployee(Long bookingId);

    void processRefund(Long bookingId);
    // Hủy lịch và xử lý chính sách hoàn tiền
    void cancelBooking(Long bookingId);

    void sendBookingEmail(Booking booking);

    Booking preInitiateBooking(Long packageId, Long slotId, LocalDate bookingDate);

    Booking finalizeBookingInfo(Long id, FinalizeBookingRequest request);
}
