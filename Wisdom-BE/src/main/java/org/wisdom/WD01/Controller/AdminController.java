package org.wisdom.WD01.Controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.CreateEmployeeAccountRequest;
import org.wisdom.WD01.Service.AccountService;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AccountService accountService;

    @PostMapping("/create-employee-account")
    public ResponseEntity<org.wisdom.WD01.Dto.Response.ApiResponse> createEmployeeAccount(
            @Valid @RequestBody CreateEmployeeAccountRequest request
    ) {

        accountService.createEmployeeAccount(request);

        return ResponseEntity.ok(
                new org.wisdom.WD01.Dto.Response.ApiResponse(true, "Employee account created successfully", null)
        );
    }
}