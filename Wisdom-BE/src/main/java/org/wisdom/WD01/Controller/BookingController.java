package org.wisdom.WD01.Controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.Request.BookingRequest;
import org.wisdom.WD01.Dto.Request.FinalizeBookingRequest;
import org.wisdom.WD01.Dto.Request.PreBookingRequest;
import org.wisdom.WD01.Dto.Response.ApiResponse;
import org.wisdom.WD01.Entity.Booking;
import org.wisdom.WD01.Entity.BookingSlot;
import org.wisdom.WD01.Enum.TargetType;
import org.wisdom.WD01.Service.BookingService;
import org.wisdom.WD01.Service.PaymentGateway;
import org.wisdom.WD01.Service.impl.VnpayServiceImpl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final PaymentGateway paymentGateway;


    @PostMapping("/pre-initiate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> preInitiate(
            @RequestBody PreBookingRequest request) {

        Booking booking = bookingService.preInitiateBooking(
                request.getPackageId(),
                request.getSlotId(),
                request.getBookingDate()
        );

        Map<String, Object> data = new HashMap<>();
        data.put("bookingId", booking.getId());
        data.put("expiresInSeconds", 600);

        return ResponseEntity.ok(new ApiResponse<>(true, "Đã giữ chỗ tạm thời trong 10 phút", data));
    }


    // Gọi khi khách nhấn nút "Thanh toán" ở cuối Form
    @PutMapping("/{id}/finalize")
    public ResponseEntity<ApiResponse<Map<String, Object>>> finalizeAndPay(
            @PathVariable Long id,
            @RequestBody FinalizeBookingRequest request) {

        // Cập nhật thông tin khách hàng vào bản ghi đã giữ chỗ
        Booking booking = bookingService.finalizeBookingInfo(id, request);

        // Tự động phân công nhân viên ngay khi khách chốt form
        bookingService.autoAssignEmployee(booking.getId());

        // Tạo link thanh toán VNPay dựa trên số tiền cọc (depositAmount)
        String paymentUrl = paymentGateway.create(
                TargetType.SERVICE,
                booking.getId(),
                booking.getDepositAmount().longValue(),
                booking.getPaymentMethod()
        );

        Map<String, Object> data = new HashMap<>();
        data.put("paymentUrl", paymentUrl);

        return ResponseEntity.ok(new ApiResponse<>(true, "Khởi tạo thanh toán thành công", data));
    }
    // Lấy danh sách slot trống theo ngày
    @GetMapping("/available-hours")
    public ResponseEntity<ApiResponse<List<LocalTime>>> getAvailableHours(
            @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        // Trả về danh sách LocalTime (giờ bắt đầu hợp lệ) thay vì List<BookingSlot>
        List<LocalTime> availableHours = bookingService.getAvailableStartTimes(serviceId, date);

        return ResponseEntity.ok(new ApiResponse(true, "Lấy danh sách giờ trống thành công", availableHours));
    }

    // Khởi tạo đặt lịch và lấy link thanh toán
//    @PostMapping("/initiate")
//    public ResponseEntity<ApiResponse<Map<String, Object>>> initiateBooking(
//            @RequestBody BookingRequest request) {
//
//        // Tạo bản ghi booking tạm thời
//        Booking booking = bookingService.initiateBooking(request);
//
//        // Tự động phân công nhân viên
//        bookingService.autoAssignEmployee(booking.getId());
//
//        // Tạo link thanh toán VNPay cho tiền đặt cọc (Lấy từ giá cấu hình của Service)
//        String paymentUrl = paymentGateway.create(
//                TargetType.BOOKING,
//                booking.getId(),
//                booking.getService().getDepositPrice().longValue(),
//                "VNPAY"
//        );
//
//        Map<String, Object> data = new HashMap<>();
//        data.put("bookingId", booking.getId());
//        data.put("paymentUrl", paymentUrl);
//
//        return ResponseEntity.ok(new ApiResponse(true, null, data));
//    }

    // Hủy lịch
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<String>> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok(new ApiResponse(true,"Đã gửi yêu cầu hủy lịch.", null));
    }

}
