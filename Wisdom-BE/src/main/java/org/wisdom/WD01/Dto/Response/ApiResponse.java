package org.wisdom.WD01.Dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ApiResponse<T>{
    private boolean success;
    private String message;
    private T data;
}