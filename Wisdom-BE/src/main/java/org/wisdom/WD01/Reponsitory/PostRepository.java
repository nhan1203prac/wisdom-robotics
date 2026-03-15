package org.wisdom.WD01.Reponsitory;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Entity.Post;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Lấy tất cả bài active
    Page<Post> findByEnabledTrueOrderByCreatedAtDesc(Pageable pageable);

    // Lấy bài active theo CategoryId
    Page<Post> findByEnabledTrueAndCategoryIdOrderByCreatedAtDesc(Long categoryId, Pageable pageable);
}
