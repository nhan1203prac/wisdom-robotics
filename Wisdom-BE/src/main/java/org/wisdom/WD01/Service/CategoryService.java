package org.wisdom.WD01.Service;

import org.wisdom.WD01.Dto.Request.CategoryRequest;
import org.wisdom.WD01.Dto.Response.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id);
    CategoryResponse updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
}
