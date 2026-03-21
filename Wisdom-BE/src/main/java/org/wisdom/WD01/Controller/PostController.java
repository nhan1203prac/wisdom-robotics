package org.wisdom.WD01.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.Request.PostRequest;
import org.wisdom.WD01.Dto.Response.ApiResponse;
import org.wisdom.WD01.Dto.Response.PageResponse;
import org.wisdom.WD01.Dto.Response.PostResponse;
import org.wisdom.WD01.Dto.Response.PostStatResponse;
import org.wisdom.WD01.Enum.ReactionType;
import org.wisdom.WD01.Service.PostService;
import org.wisdom.WD01.Util.SecurityUtil;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(@RequestBody PostRequest postRequest) {
        String username = SecurityUtil.getAuthenticatedUsername();
        PostResponse post = postService.createPost(postRequest, username);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Create post successful", post)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(@PathVariable Long id, @RequestBody PostRequest postRequest) {
        String username = SecurityUtil.getAuthenticatedUsername();
        PostResponse post = postService.updatePost(id, postRequest, username);
        return ResponseEntity.ok(new ApiResponse<>(true, "Update post successful", post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Delete post successful", null)
        );
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getAllActivePost(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<PostResponse> postPage = postService.getAllActivePost(categoryId, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Get all active posts", postPage));
    }
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<PostResponse>> getPostById(@PathVariable Long id) {
        PostResponse post = postService.getPostById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Get post successful", post)
        );
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<PostStatResponse>> toggleStatus(
            @PathVariable Long id,
            @RequestParam String feature //POST", "COMMENT", Or "REACT"
    ) {

        PostStatResponse stat = postService.toggleFeature(id, feature);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Update " + feature.toLowerCase() + " status successful", stat)
        );
    }


    @PostMapping("/{id}/react")
    public ResponseEntity<ApiResponse<PostStatResponse>> reactToPost(
            @PathVariable Long id,
            @RequestParam ReactionType type) {
        String username = SecurityUtil.getAuthenticatedUsername();
        PostStatResponse stat = postService.reactToPost(id, username, type);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "React post successful", stat)
        );
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<ApiResponse<PostStatResponse>> ratePost(
            @PathVariable Long id,
            @RequestParam int stars) {
        String username = SecurityUtil.getAuthenticatedUsername();
        PostStatResponse stat = postService.ratePost(id, username, stars);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "rate the article successful", stat)
        );
    }
}
