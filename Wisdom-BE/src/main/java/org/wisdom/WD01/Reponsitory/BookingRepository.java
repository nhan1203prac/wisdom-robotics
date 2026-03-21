package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.wisdom.WD01.Entity.Booking;
import org.wisdom.WD01.Enum.BookingCrmStatus;
import org.wisdom.WD01.Enum.PaymentStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Tìm các booking PENDING đã quá hạn 5 phút
    List<Booking> findByPaymentStatusAndCreatedAtBefore(PaymentStatus status, LocalDateTime dateTime);

    // Tìm các booking PAID sắp diễn ra trong khoảng thời gian xác định
    @Query("SELECT b FROM Booking b WHERE b.paymentStatus = 'PAID' " +
            "AND b.bookingDate = :date " +
            "AND b.slot.startTime BETWEEN :start AND :end")
    List<Booking> findBookingsToRemind(
            @Param("date") LocalDate date,
            @Param("start") LocalTime start,
            @Param("end") LocalTime end);

    @Query("SELECT b FROM Booking b WHERE b.bookingDate = :date AND b.paymentStatus != 'CANCELLED'")
    List<Booking> findActiveBookingsByDate(@Param("date") LocalDate date);

    // Kiểm tra xem từ slot hiện tại + các slot tiếp theo có ai đặt chưa
    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
            "WHERE b.bookingDate = :date " +
            "AND b.paymentStatus != org.wisdom.WD01.Enum.PaymentStatus.CANCELLED " +
            "AND ((b.slot.startTime < :endTime AND b.slot.startTime >= :startTime) " +
            "OR (b.slot.endTime > :startTime AND b.slot.endTime <= :endTime))")
    boolean existsOverlap(
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );



    void deleteByCrmStatusAndCreatedAtBefore(BookingCrmStatus status, LocalDateTime oneMonthAgo);
}