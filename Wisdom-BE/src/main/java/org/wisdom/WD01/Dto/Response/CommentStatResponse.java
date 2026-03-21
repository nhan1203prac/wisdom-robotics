package org.wisdom.WD01.Dto.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentStatResponse {
    private Long id;
    private int likeCount;
    private int dislikeCount;
}
