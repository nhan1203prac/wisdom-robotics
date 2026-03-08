package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.wisdom.WD01.Entity.CommentReaction;

import java.util.Optional;

public interface CommentReactionRepository extends JpaRepository<CommentReaction, Long> {

    @Query("""
        SELECT cr FROM CommentReaction cr 
        WHERE cr.user.id = :userId 
          AND cr.comment.id = :commentId
    """)
    Optional<CommentReaction> findByUserIdAndCommentId(
            @Param("userId") Long userId,
            @Param("commentId") Long commentId
    );
}
