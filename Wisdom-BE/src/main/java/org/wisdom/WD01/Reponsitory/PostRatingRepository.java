package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Entity.Post;
import org.wisdom.WD01.Entity.PostRating;

import java.util.Optional;

public interface PostRatingRepository extends JpaRepository<PostRating, Long> {
    Optional<PostRating> findByUserIdAndPostId(Long userId, Long postId);
}
