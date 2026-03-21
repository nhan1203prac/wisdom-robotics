package org.wisdom.WD01.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.wisdom.WD01.Dto.Response.ApiResponse;
import org.wisdom.WD01.Dto.ServiceResponseDto;
import org.wisdom.WD01.Entity.Company;
import org.wisdom.WD01.Entity.ServiceCategory;
import org.wisdom.WD01.Entity.ServiceEntity;
import org.wisdom.WD01.Reponsitory.ServiceCategoryRepository;
import org.wisdom.WD01.Reponsitory.ServiceRepository;
import org.wisdom.WD01.Reponsitory.CompanyRepository;
import org.wisdom.WD01.Service.ServiceService;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {
    private final ServiceRepository serviceRepository;
    private final ServiceService serviceService;
    private final CompanyRepository companyRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    // =============================
    // GET ALL SERVICES
    // =============================
    @GetMapping
    public ResponseEntity<ApiResponse> getAllServices() {

        List<ServiceEntity> services = serviceService.getAll();

        List<ServiceResponseDto> dtos = services.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new ApiResponse(true,"Lấy danh sách dịch vụ thành công",dtos)
        );
    }

    // =============================
    // GET SERVICE DETAIL
    // =============================
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getServiceDetail(@PathVariable Long id){

        ServiceEntity service = serviceService.getById(id);

        return ResponseEntity.ok(
                new ApiResponse(true,"Lấy chi tiết dịch vụ",mapToDto(service))
        );
    }

    // =============================
    // CREATE SERVICE (UPLOAD IMAGE)
    // =============================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> create(
            @RequestParam("serviceName") String serviceName,
            @RequestParam("description") String description,
            @RequestParam("basePrice") BigDecimal basePrice,
            @RequestParam("depositPrice") BigDecimal depositPrice, // Thêm tiền cọc
            @RequestParam("durationMinutes") Integer durationMinutes, // Thêm thời lượng
            @RequestParam("categoryId") Long categoryId, // BỔ SUNG CATEGORY ID
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail
    ) {
        try {
            String fileName = null;
            if (thumbnail != null && !thumbnail.isEmpty()) {
                fileName = System.currentTimeMillis() + "_" + thumbnail.getOriginalFilename();
                String uploadDir = "uploads/images";
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(thumbnail.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            ServiceEntity service = new ServiceEntity();
            service.setServiceName(serviceName);
            service.setDescription(description);
            service.setBasePrice(basePrice);
            service.setDepositPrice(depositPrice); // Set tiền cọc
            service.setDurationMinutes(durationMinutes); // Set thời lượng
            service.setIsBookingService(true); // Đánh dấu đây là dịch vụ đặt lịch
            service.setThumbnail(fileName);

            service.setRatingAvg(BigDecimal.ZERO);
            service.setRatingCount(0);
            service.setViewCount(0);
            service.setSearchCount(0);

            // 1. Lấy Company
            Company company = companyRepository.findById(1L)
                    .orElseThrow(() -> new RuntimeException("Company không tồn tại"));
            service.setCompany(company);

            // 2. BỔ SUNG: Lấy ServiceCategory từ database
            ServiceCategory category = serviceCategoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Danh mục dịch vụ không tồn tại"));
            service.setCategory(category);

            // Lưu DB
            ServiceEntity created = serviceRepository.save(service);

            return ResponseEntity.ok(
                    new ApiResponse(true, "Tạo service thành công", created)
            );

        } catch (IOException e) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "Upload ảnh thất bại", null)
            );
        }
    }

    // =============================
    // UPDATE SERVICE
    // =============================
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> update(
            @PathVariable Long id,
            @RequestParam("serviceName") String serviceName,
            @RequestParam("description") String description,
            @RequestParam("basePrice") BigDecimal basePrice,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail
    ) {

        try {

            ServiceEntity service = serviceRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Service không tồn tại"));

            service.setServiceName(serviceName);
            service.setDescription(description);
            service.setBasePrice(basePrice);

            if (thumbnail != null && !thumbnail.isEmpty()) {

                String fileName = System.currentTimeMillis() + "_" + thumbnail.getOriginalFilename();

                // 🔥 LƯU ĐÚNG THƯ MỤC
                Path uploadPath = Paths.get("uploads/images");

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                Path filePath = uploadPath.resolve(fileName);

                Files.copy(
                        thumbnail.getInputStream(),
                        filePath,
                        StandardCopyOption.REPLACE_EXISTING
                );

                service.setThumbnail(fileName);
            }

            ServiceEntity updated = serviceRepository.save(service);

            return ResponseEntity.ok(
                    new ApiResponse(true, "Update thành công", updated)
            );

        } catch (IOException e) {

            return ResponseEntity.badRequest().body(
                    new ApiResponse(false, "Update thất bại", null)
            );
        }
    }

    // =============================
    // DELETE SERVICE
    // =============================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id){

        serviceService.delete(id);

        return ResponseEntity.ok(
                new ApiResponse(true,"Xóa service thành công",null)
        );
    }

    // =============================
    // SEARCH SERVICE
    // =============================
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> search(@RequestParam String keyword){

        List<ServiceEntity> services = serviceService.search(keyword);

        List<ServiceResponseDto> dtos = services.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new ApiResponse(true,"Tìm kiếm thành công",dtos)
        );
    }

    // =============================
    // SEARCH BY CATEGORY
    // =============================
    @GetMapping("/category/{id}")
    public ResponseEntity<ApiResponse> searchByCategory(@PathVariable Long id){

        List<ServiceEntity> services = serviceService.searchByCategory(id);

        List<ServiceResponseDto> dtos = services.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                new ApiResponse(true,"Lọc theo danh mục thành công",dtos)
        );
    }

    // =============================
    // MAP ENTITY → DTO
    // =============================
    private ServiceResponseDto mapToDto(ServiceEntity service){

        ServiceResponseDto dto = new ServiceResponseDto();

        dto.setServiceId(service.getId());
        dto.setServiceName(service.getServiceName());
        dto.setDescription(service.getDescription());
        dto.setBasePrice(service.getBasePrice());
        dto.setRatingAvg(service.getRatingAvg());
        dto.setRatingCount(service.getRatingCount());
        dto.setCreatedAt(service.getCreatedAt());
        dto.setThumbnail(service.getThumbnail());
        dto.setViewCount(service.getViewCount());
        dto.setSearchCount(service.getSearchCount());

        if(service.getCompany()!=null){

            ServiceResponseDto.CompanySimpleDto companyDto =
                    new ServiceResponseDto.CompanySimpleDto();

            companyDto.setCompanyId(service.getCompany().getId());
            companyDto.setCompanyName(service.getCompany().getCompanyName());

            dto.setCompany(companyDto);
        }

        return dto;
    }

    // ==========================
    // GET POPULAR SERVICES
    // ==========================
    @GetMapping("/popular")
    public List<ServiceEntity> getPopularServices() {
        return serviceService.getPopularServices();
    }

    // ==========================
    // GET TOP RATED SERVICES
    // ==========================
    @GetMapping("/top-rated")
    public List<ServiceEntity> getTopRatedServices() {
        return serviceService.getTopRatedServices();
    }

    // ==========================
    // GET LATEST SERVICES
    // ==========================
    @GetMapping("/latest")
    public List<ServiceEntity> getLatestServices() {
        return serviceService.getLatestServices();
    }

}