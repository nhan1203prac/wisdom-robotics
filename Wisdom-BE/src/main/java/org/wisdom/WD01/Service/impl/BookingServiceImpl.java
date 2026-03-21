package org.wisdom.WD01.Service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wisdom.WD01.Dto.Request.BookingRequest;
import org.wisdom.WD01.Dto.Request.FinalizeBookingRequest;
import org.wisdom.WD01.Entity.Booking;
import org.wisdom.WD01.Entity.BookingSlot;
import org.wisdom.WD01.Entity.Employee;
import org.wisdom.WD01.Entity.User;
import org.wisdom.WD01.Enum.BookingCrmStatus;
import org.wisdom.WD01.Enum.PaymentStatus;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Reponsitory.*;
import org.wisdom.WD01.Service.BookingService;
import org.wisdom.WD01.Service.EmailService;
import org.wisdom.WD01.Util.SecurityUtil;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

     private final BookingRepository bookingRepo;
     private final BookingSlotRepository slotRepo;
     private final ServicePackageRepository servicePackageRepo;
     private final EmployeeRepository employeeRepo;
     private final EmailService emailService;
     private final ServiceRepository serviceRepository;
     private final UserRepository userRepository;
    @Override
    public List<LocalTime> getAvailableStartTimes(Long serviceId, LocalDate date) {
        var service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new AppException("Service not found"));

        int duration = service.getDurationMinutes();
        int blocks = (int)Math.ceil(duration / 30.0);
        // get all slot
        List<BookingSlot> allSlots = slotRepo.findByDateAndIsActiveTrueOrderByStartTimeAsc(date);
        // get booking have been booking
        List<Booking> activeBookings = bookingRepo.findActiveBookingsByDate(date);
//        System.out.print("occupied slots: "+ activeBooking);

        return allSlots.stream().filter(slot ->{
            int startIndex = allSlots.indexOf(slot);
            if(startIndex + blocks > allSlots.size()) {
                return false;
            }

            LocalTime windowStart = slot.getStartTime();
            LocalTime windowEnd = windowStart.plusMinutes(service.getDurationMinutes());

            boolean isOccupied = activeBookings.stream().anyMatch(b ->
                    windowStart.isBefore(b.getEndTime()) && windowEnd.isAfter(b.getStartTime())
            );

            if(isOccupied) {
                return false;
            }

            for (int i = 1; i < blocks; i++) {
                if (!allSlots.get(startIndex + i - 1).getEndTime()
                        .equals(allSlots.get(startIndex + i).getStartTime())) {
                    return false;
                }
            }
            return true;
        }).map(BookingSlot::getStartTime).collect(Collectors.toList());
    }


    @Override
    public Booking confirmBooking(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new AppException("Không tìm thấy thông tin đặt lịch"));

        // Cập nhật trạng thái
        booking.setPaymentStatus(PaymentStatus.SUCCESS);
        booking.setCrmStatus(BookingCrmStatus.CONTACTED);

        // Lưu vào database
        Booking savedBooking = bookingRepo.save(booking);

        // Gửi email xác nhận ngay lập tức
        try {
            this.sendBookingEmail(savedBooking);
        } catch (Exception e) {
            System.err.println("Lỗi gửi mail: " + e.getMessage());
        }

        return savedBooking;
    }

    @Override
    public void autoAssignEmployee(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId).orElseThrow();

        // Lấy ID từ ServiceCategory
        Long catId = booking.getService().getCategory().getId();

        List<Employee> eligibleEmployees = employeeRepo.findAvailableEmployees(
                catId,
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!eligibleEmployees.isEmpty()) {
            booking.setAssignedEmployee(eligibleEmployees.get(0));
            bookingRepo.save(booking);
        }else{
            System.err.println(">>> Cảnh báo: Không có nhân viên nào rảnh trong khung giờ này!");
        }
    }

    @Override
    public void processRefund(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new AppException("Booking not found"));

        booking.setPaymentStatus(PaymentStatus.REFUNDED);

        booking.setAssignedEmployee(null);

        bookingRepo.save(booking);
    }

    @Override
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new AppException("Không tìm thấy thông tin đặt lịch"));

        // Tính toán thời gian còn lại đến buổi hẹn
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime appointmentTime = LocalDateTime.of(booking.getBookingDate(), booking.getSlot().getStartTime());

        long hoursUntilAppointment = java.time.Duration.between(now, appointmentTime).toHours();

        // Kiểm tra chính sách hủy
        if (hoursUntilAppointment >= 24) {
            // Trước 24h: Hoàn tiền (Cần gọi sang PaymentService để xử lý Refund)
            booking.setPaymentStatus(PaymentStatus.REFUND_PENDING);
            // logic gọi API hoàn tiền của VNPay/Momo tại đây
        } else {
            // Dưới 24h: Không hoàn tiền
            booking.setPaymentStatus(PaymentStatus.REFUND_REJECTED);
        }

        // Cập nhật trạng thái chung và giải phóng Slot
        booking.setCrmStatus(BookingCrmStatus.DEAL_LOST);
        bookingRepo.save(booking);
    }

    @Override
    public void sendBookingEmail(Booking booking) {
        String subject = "Xác nhận lịch hẹn từ Wisdom Robotics - #" + booking.getId();

        StringBuilder content = new StringBuilder();
        content.append("Kính chào ").append(booking.getFullName()).append(",\n\n");
        content.append("Cảm ơn bạn đã đặt lịch hẹn tư vấn tại Wisdom Robotics.\n");
        content.append("Thông tin chi tiết lịch hẹn của bạn:\n");
        content.append("- Dịch vụ: ").append(booking.getService().getServiceName()).append("\n");
        content.append("- Thời gian: ").append(booking.getSlot().getStartTime())
                .append(" ngày ").append(booking.getBookingDate()).append("\n");

        // Xử lý loại hình cuộc hẹn
        if ("ONLINE".equals(booking.getMeetingType())) {
            content.append("- Hình thức: Online Meeting\n");
            content.append("- Link tham gia: ").append(booking.getMeetingLink()).append("\n");
        } else {
            content.append("- Hình thức: Offline tại văn phòng công ty\n");
            content.append("- Địa điểm: Tòa nhà Wisdom, TP. Đà Nẵng\n");
        }

        content.append("\nChúng tôi sẽ liên hệ lại với bạn trước buổi hẹn. Trân trọng!");

        emailService.sendEmail(booking.getEmail(), subject, content.toString());
    }

    @Override
    public Booking preInitiateBooking(Long packageId, Long slotId, LocalDate bookingDate) {
        var pkg = servicePackageRepo.findById(packageId)
                .orElseThrow(() -> new AppException("Package not found"));
        var slot = slotRepo.findById(slotId)
                .orElseThrow(() -> new AppException("Slot not found"));

        int duration = pkg.getService().getDurationMinutes();
        LocalTime startTime = slot.getStartTime();
        LocalTime endTime = startTime.plusMinutes(duration);

        // Kiểm tra xem khoảng này có bị ai chiếm chưa
        if (bookingRepo.existsOverlap(bookingDate, startTime, endTime)) {
            throw new AppException("Rất tiếc, khung giờ này vừa có người khác giữ chỗ. Vui lòng chọn giờ khác!");
        }

        Booking booking = new Booking();
        booking.setBookingDate(bookingDate);
        booking.setSlot(slot);
        booking.setService(pkg.getService());
        booking.setServicePackage(pkg);

        booking.setStartTime(slot.getStartTime());
        booking.setEndTime(slot.getStartTime().plusMinutes(duration));

        booking.setTotalAmount(pkg.getPrice());
        booking.setDepositAmount(pkg.getService().getDepositPrice());
        booking.setPaymentStatus(PaymentStatus.PENDING);

        String username = SecurityUtil.getAuthenticatedUsername();
        if(username == null){
            throw new AppException("You have not logged in");
        }
        booking.setUser(userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found")));

        return bookingRepo.save(booking);

    }

    @Override
    public Booking finalizeBookingInfo(Long id, FinalizeBookingRequest request) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new AppException("Booking not found"));

        // Kiểm tra thời gian hết hạn (10 phút)
        LocalDateTime expiryTime = booking.getCreatedAt().plusMinutes(10);
        if (LocalDateTime.now().isAfter(expiryTime)) {
            booking.setPaymentStatus(PaymentStatus.CANCELLED);
            bookingRepo.save(booking);
            throw new AppException("Your session book has expired (10 phút).");
        }
        // Thông tin dự án & Doanh nhiệp
        booking.setFullName(request.getFullName());
        booking.setPhoneNumber(request.getPhoneNumber());
        booking.setEmail(request.getEmail());
        booking.setCompanyName(request.getCompanyName());
        booking.setCurrentWebsite(request.getCurrentWebsite());

        // Thông tin dự án
        booking.setProjectDescription(request.getProjectDescription());
        booking.setExpectedBudget(request.getExpectedBudget());
        booking.setImplementationTime(request.getImplementationTime());
        booking.setMeetingType(request.getMeetingType());
        booking.setPaymentMethod(request.getPaymentMethod());
        // Logic xử lý Link họp Online
        if ("ONLINE".equalsIgnoreCase(request.getMeetingType())) {
            // Chỉ tạo link nếu trước đó chưa có link (tránh tạo đè khi khách update form)
            if (booking.getMeetingLink() == null) {
                String meetingCode = java.util.UUID.randomUUID().toString().substring(0, 8);
                booking.setMeetingLink("https://meet.google.com/wisdom-robotics-" + meetingCode);
            }
        } else {
            // Nếu chuyển sang OFFLINE thì xóa link cũ
            booking.setMeetingLink(null);
        }
        return bookingRepo.save(booking);
    }
}