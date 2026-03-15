package org.wisdom.WD01.Dto.Response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private String authorName;
    private int likeCount;
    private int dislikeCount;
    private int replyCount;
    private boolean userLiked;
    private boolean userDisliked;
    private Long parentId;
    private Instant createdAt;
}
