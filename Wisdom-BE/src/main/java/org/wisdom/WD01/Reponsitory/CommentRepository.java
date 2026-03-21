package org.wisdom.WD01.Reponsitory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.wisdom.WD01.Entity.Comment;
import org.wisdom.WD01.Entity.CommentReaction;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("""
        SELECT c 
        FROM Comment c 
        JOIN FETCH c.user 
        WHERE c.post.id = :postId 
          AND c.enabled = true 
          AND c.parent IS NULL 
        ORDER BY c.createdAt ASC
        """)
    Page<Comment> findRootComments(@Param("postId") Long postId, Pageable pageable);

    @Query("""
        SELECT c 
        FROM Comment c 
        JOIN FETCH c.user 
        WHERE c.parent.id = :parentId 
          AND c.enabled = true 
        ORDER BY c.createdAt ASC
        """)
    Page<Comment> findReplies(@Param("parentId") Long parentId, Pageable pageable);


}