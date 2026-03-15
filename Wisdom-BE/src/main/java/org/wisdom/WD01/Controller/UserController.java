package org.wisdom.WD01.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.wisdom.WD01.Dto.Response.ApiResponse;
import org.wisdom.WD01.Dto.Response.UserResponse;
import org.wisdom.WD01.Entity.User;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Reponsitory.UserRepository;
import org.wisdom.WD01.Util.SecurityUtil;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<UserResponse>> getUsers() {
        String username = SecurityUtil.getAuthenticatedUsername();
        if (username == null) {
            throw new AppException("Unauthenticated user");
        }
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException("User not found"));
        UserResponse res = UserResponse.builder()
                .id(user.getId())
                .phone(user.getPhone())
                .role(user.getRole().getRoleName())
                .email(user.getEmail())
                .username(user.getUsername())
                .createdAt(user.getCreatedAt())
                .status(user.getStatus())
                .build();
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                        .success(true)
                        .data(res)
                        .message("User found")
                .build());
    }
}
