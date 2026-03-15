package org.wisdom.WD01.Service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wisdom.WD01.Dto.Request.CategoryRequest;
import org.wisdom.WD01.Dto.Response.CategoryResponse;
import org.wisdom.WD01.Entity.Category;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Reponsitory.CategoryRepository;
import org.wisdom.WD01.Service.CategoryService;
import org.wisdom.WD01.Util.Validation;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final Validation validation;

    // Create a new category with basic validation
    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        validation.validateCategory(request);

        Category category = Category.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .build();

        return mapToResponse(categoryRepository.save(category));
    }

    // Get all categories from database
    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get a specific category by its ID
    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException("Category not found with id: " + id));
        return mapToResponse(category);
    }

    // Update category details (name and description)
    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException("Category not found"));

        validation.validateCategory(request);

        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());

        return mapToResponse(categoryRepository.save(category));
    }

    // Delete a category by ID
    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    // Helper: Convert Category Entity to Response DTO
    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}