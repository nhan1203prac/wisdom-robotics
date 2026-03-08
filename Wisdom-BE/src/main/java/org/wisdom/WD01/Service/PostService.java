package org.wisdom.WD01.Service;

import org.wisdom.WD01.Dto.Request.PostRequest;
import org.wisdom.WD01.Dto.Response.PageResponse;
import org.wisdom.WD01.Dto.Response.PostResponse;
import org.wisdom.WD01.Dto.Response.PostStatResponse;
import org.wisdom.WD01.Enum.ReactionType;

public interface PostService {

    PostResponse createPost(PostRequest postRequest, String username);
    PageResponse<PostResponse> getAllActivePost(int page, int size);
    PostResponse getPostById(Long postId);
    PostStatResponse togglePostStatus(Long postId);
    PostStatResponse reactToPost(Long postId, String username, ReactionType type);
    PostStatResponse ratePost(Long postId, String username, int stars);
}
