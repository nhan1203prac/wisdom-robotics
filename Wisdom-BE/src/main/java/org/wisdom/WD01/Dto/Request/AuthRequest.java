package org.wisdom.WD01.Dto.Request;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}