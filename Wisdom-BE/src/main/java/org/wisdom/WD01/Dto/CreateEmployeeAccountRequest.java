package org.wisdom.WD01.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateEmployeeAccountRequest {

    @NotBlank
    private String employeeId;

    @NotBlank
    private String phone;

    @Email
    private String email;

}