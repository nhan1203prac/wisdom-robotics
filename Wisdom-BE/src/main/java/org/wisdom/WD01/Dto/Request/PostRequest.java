package org.wisdom.WD01.Dto.Request;

import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String content;
    private Long categoryId;
}
