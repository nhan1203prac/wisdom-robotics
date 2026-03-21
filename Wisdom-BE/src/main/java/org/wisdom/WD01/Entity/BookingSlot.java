package org.wisdom.WD01.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "booking_slots")
@Data
public class BookingSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalTime startTime;
    private LocalTime endTime;

    private LocalDate date;

    private Integer maxCapacity = 1; // Mặc định mỗi slot 1 khách

    private Boolean isActive = true;
}