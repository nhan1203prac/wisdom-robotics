package org.wisdom.WD01.Service;

import org.springframework.data.domain.Page;
import org.wisdom.WD01.Dto.Response.CommentResponse;
import org.wisdom.WD01.Dto.Response.CommentStatResponse;
import org.wisdom.WD01.Dto.Response.PageResponse;
import org.wisdom.WD01.Entity.Comment;
import org.wisdom.WD01.Enum.ReactionType;

public interface CommentService {
    CommentResponse addComment(Long postId, Long parentId, String content, String username);
    PageResponse<CommentResponse> getRootComments(Long postId, int page, int size);
    PageResponse<CommentResponse> getReplies(Long parentId, int page, int size);
    CommentStatResponse reactToComment(Long commentId, String username, ReactionType type);
}

