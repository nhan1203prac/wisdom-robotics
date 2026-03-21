package org.wisdom.WD01.Dto.Response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private int likeCount;
    private int dislikeCount;
    private double ratingAvg;
    private int ratingCount;
    private Long categoryId;
    private String categoryName;
    private boolean enabled;
    private boolean commentEnabled;
    private boolean reactionEnabled;
    private int commentCount;
    private Instant createdAt;
    private Instant updatedAt;
}
