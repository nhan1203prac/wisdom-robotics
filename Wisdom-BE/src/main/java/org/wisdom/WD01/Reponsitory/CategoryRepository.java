package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Entity.PostCategory;

public interface CategoryRepository extends JpaRepository<PostCategory, Long> {

    boolean existsByName(String name);
}
