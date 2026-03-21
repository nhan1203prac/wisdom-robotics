package org.wisdom.WD01.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.Response.ApiResponse;
import org.wisdom.WD01.Entity.ServicePackage;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Reponsitory.ServicePackageRepository;
import org.wisdom.WD01.Reponsitory.ServiceRepository;

import java.util.List;

@RestController
@RequestMapping("/api/service-packages")
@RequiredArgsConstructor
public class ServicePackageController {
    private final ServicePackageRepository packageRepo;
    private final ServiceRepository serviceRepo;

    // Lấy danh sách các gói của một Dịch vụ (Dùng cho khách hàng chọn gói)
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<ApiResponse<List<ServicePackage>>> getPackagesByService(
            @PathVariable Long serviceId) {
        List<ServicePackage> packages = packageRepo.findByServiceId(serviceId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Get list service package", packages));
    }

    // Thêm mới một gói (Dùng cho Admin)
    @PostMapping("/service/{serviceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ServicePackage>> createPackage(
            @PathVariable Long serviceId,
            @RequestBody ServicePackage servicePackage) {

        var service = serviceRepo.findById(serviceId)
                .orElseThrow(() -> new AppException("Service not found"));

        servicePackage.setService(service);
        ServicePackage saved = packageRepo.save(servicePackage);

        return ResponseEntity.ok(new ApiResponse<>(true, "Create successful", saved));
    }

    // Xóa gói
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePackage(@PathVariable Long id) {
        packageRepo.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Delete package successful", null));
    }

}
