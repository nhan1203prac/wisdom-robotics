package org.wisdom.WD01.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.Response.ApiResponse;
import org.wisdom.WD01.Entity.BookingSlot;
import org.wisdom.WD01.Reponsitory.BookingSlotRepository;

import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class BookingSlotController {

    private final BookingSlotRepository bookingSlotRepository;

    // Lấy tất cả khung giờ
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<Void>> generate(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                             @RequestParam String startTime, // Ví dụ: "08:00"
                                                             @RequestParam String endTime )   // Ví dụ: "17:00") {}
    {
        LocalTime start = LocalTime.parse(startTime);
        LocalTime end = LocalTime.parse(endTime);
        int count = 0;
        while (start.isBefore(end)) {
            LocalTime next = start.plusMinutes(30);

            if(!bookingSlotRepository.existsByDateAndStartTimeAndEndTime(date,start,next)){
                BookingSlot slot = new BookingSlot();
                slot.setDate(date);
                slot.setStartTime(start);
                slot.setEndTime(next);
                slot.setIsActive(true);
                slot.setMaxCapacity(1);
                bookingSlotRepository.save(slot);
                count++;
            }
            start = next;

        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Created " + count + " slots for date " + date, null));
    }
}
