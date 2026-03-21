package org.wisdom.WD01.Dto.Request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PreBookingRequest {
    private Long packageId;
    private Long slotId;
    private LocalDate bookingDate;
}
