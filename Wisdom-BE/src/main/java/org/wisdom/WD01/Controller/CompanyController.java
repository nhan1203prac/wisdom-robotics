package org.wisdom.WD01.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.Response.ApiResponse;
import org.wisdom.WD01.Dto.Response.PageResponse;
import org.wisdom.WD01.Entity.Company;
import org.wisdom.WD01.Entity.User;
import org.wisdom.WD01.Reponsitory.UserRepository;
import org.wisdom.WD01.Reponsitory.CompanyRepository;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyRepository companyRepo;
    private final UserRepository userRepo;

    //Tạo công ty
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<Company>> create(@RequestBody Company company,
                                                       @RequestParam Long ownerId) {

        // Tìm User làm chủ sở hữu công ty
        User owner = userRepo.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("User chủ sở hữu không tồn tại"));

        company.setOwnerUser(owner);
        company.setCreatedAt(Instant.now());

        Company saved = companyRepo.save(company);
        return ResponseEntity.ok(new ApiResponse(true, "created successful", saved));
    }

    // Lấy thông tin công ty
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Company>> getById(@PathVariable Long id) {
        Company company = companyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công ty"));
        return ResponseEntity.ok(new ApiResponse(true, "Get company info", company));
    }

    // Lấy danh sách tất cả công ty
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Company>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Company> companyPage = companyRepo.findAll(pageable);

        PageResponse<Company> response = PageResponse.<Company>builder()
                .content(companyPage.getContent())
                .page(companyPage.getNumber())
                .size(companyPage.getSize())
                .totalElements(companyPage.getTotalElements())
                .totalPages(companyPage.getTotalPages())
                .build();
        return ResponseEntity.ok(new ApiResponse(true, "Get list of companies", response));
    }
}