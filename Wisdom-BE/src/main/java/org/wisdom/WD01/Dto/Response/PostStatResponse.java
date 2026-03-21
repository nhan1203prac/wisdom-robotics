package org.wisdom.WD01.Dto.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostStatResponse {
    private Long id;
    private int likeCount;
    private int dislikeCount;
    private double ratingAvg;
    private int ratingCount;
    private boolean enabled;
    private boolean commentEnabled;
    private boolean reactionEnabled;
}