package org.wisdom.WD01.Service;

import org.springframework.transaction.annotation.Transactional;
import org.wisdom.WD01.Dto.Request.PostRequest;
import org.wisdom.WD01.Dto.Response.PageResponse;
import org.wisdom.WD01.Dto.Response.PostResponse;
import org.wisdom.WD01.Dto.Response.PostStatResponse;
import org.wisdom.WD01.Enum.ReactionType;

public interface PostService {

    PostResponse createPost(PostRequest postRequest, String username);


    PostResponse updatePost(Long postId, PostRequest postRequest, String username);
    void deletePost(Long postId, String username);
    PageResponse<PostResponse> getAllActivePost(Long categoryId, int page, int size);
    PostResponse getPostById(Long postId);
    PostStatResponse toggleFeature(Long postId, String feature);
    PostStatResponse reactToPost(Long postId, String username, ReactionType type);
    PostStatResponse ratePost(Long postId, String username, int stars);
}
