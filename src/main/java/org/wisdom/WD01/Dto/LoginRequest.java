package org.wisdom.WD01.Dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}