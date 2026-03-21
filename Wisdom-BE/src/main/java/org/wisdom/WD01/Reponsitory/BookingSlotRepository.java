package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Entity.BookingSlot;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingSlotRepository extends JpaRepository<BookingSlot, Long> {
    List<BookingSlot> findAllByIsActiveTrue();

    boolean existsByStartTimeAndEndTime(LocalTime startTime, LocalTime endTime);


    List<BookingSlot> findByDateAndIsActiveTrueOrderByStartTimeAsc(LocalDate date);

    boolean existsByDateAndStartTimeAndEndTime(LocalDate date, LocalTime startTime, LocalTime endTime);
}