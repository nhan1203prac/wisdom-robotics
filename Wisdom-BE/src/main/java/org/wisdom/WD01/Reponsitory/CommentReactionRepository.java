package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.wisdom.WD01.Entity.CommentReaction;

import java.util.List;
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

    @Query("SELECT r FROM CommentReaction r WHERE r.user.id = :userId AND r.comment.post.id = :postId")
    List<CommentReaction> findAllByUserIdAndPostId(Long userId, Long postId);
}
