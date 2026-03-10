package org.wisdom.WD01.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.Response.ApiResponse;
import org.wisdom.WD01.Dto.Response.CommentResponse;
import org.wisdom.WD01.Dto.Response.PageResponse;
import org.wisdom.WD01.Entity.Comment;
import org.wisdom.WD01.Enum.ReactionType;
import org.wisdom.WD01.Service.CommentService;
import org.wisdom.WD01.Util.SecurityUtil;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/{postId}")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable Long postId,
            @RequestParam(required = false) Long parentId,
            @RequestBody String content) {

        String username = SecurityUtil.getAuthenticatedUsername();
        CommentResponse comment = commentService.addComment(postId, parentId, content, username);

        return ResponseEntity.ok(new ApiResponse<>(true, "Comment send successful", comment));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<PageResponse<CommentResponse>>> getRootComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<CommentResponse> comments = commentService.getRootComments(postId, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", comments));
    }

    @GetMapping("/{parentId}/replies")
    public ResponseEntity<ApiResponse<PageResponse<CommentResponse>>> getReplies(
            @PathVariable Long parentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<CommentResponse> replies = commentService.getReplies(parentId, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", replies));
    }

    @PostMapping("/{commentId}/react")
    public ResponseEntity<ApiResponse<Void>> reactToComment(
            @PathVariable Long commentId,
            @RequestParam ReactionType type) {

        String username = SecurityUtil.getAuthenticatedUsername();
        commentService.reactToComment(commentId, username, type);

        return ResponseEntity.ok(new ApiResponse<>(true, "React successful", null));
    }
}
