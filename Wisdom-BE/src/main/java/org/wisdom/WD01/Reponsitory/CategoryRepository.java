package org.wisdom.WD01.Reponsitory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Dto.Response.CategoryResponse;
import org.wisdom.WD01.Entity.Category;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByName(String name);
}
