package org.wisdom.WD01.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.Response.ApiResponse;
import org.wisdom.WD01.Entity.ServiceCategory;
import org.wisdom.WD01.Reponsitory.ServiceCategoryRepository;

import java.util.List;

@RestController
@RequestMapping("/api/service-categories")
@RequiredArgsConstructor
public class ServiceCategoryController {

    private final ServiceCategoryRepository categoryRepository;

    // Lấy tất cả danh mục dịch vụ
    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceCategory>>> getAll() {
        List<ServiceCategory> categories = categoryRepository.findAll();
        return ResponseEntity.ok(new ApiResponse(true,null, categories));
    }

    // Tạo mới một danh mục (Ví dụ: Tư vấn AI, Thiết kế Web)
    @PostMapping
    public ResponseEntity<ApiResponse<ServiceCategory>> create(@RequestBody ServiceCategory category) {
        ServiceCategory saved = categoryRepository.save(category);
        return ResponseEntity.ok(new ApiResponse(true, null, saved));
    }

    // Xóa danh mục
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Xóa danh mục thành công", null));
    }
}
