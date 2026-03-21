package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Entity.PostRating;
import org.wisdom.WD01.Entity.PostReaction;

import java.util.Optional;

public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {
    Optional<PostReaction> findByUserIdAndPostId(Long userId, Long postId);

}
