package org.wisdom.WD01.Dto.Response;

import lombok.*;

@Data
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String icon;
    private String description;
}