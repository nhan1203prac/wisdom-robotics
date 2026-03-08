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
    private boolean enabled;
    private Instant createdAt;
    private Instant updatedAt;
}
