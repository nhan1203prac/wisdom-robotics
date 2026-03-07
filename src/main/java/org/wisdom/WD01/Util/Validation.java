package org.wisdom.WD01.Util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.wisdom.WD01.Dto.AuthRequest;
import org.wisdom.WD01.Dto.RegisterRequest;
import org.wisdom.WD01.Dto.ResetPasswordRequest;
import org.wisdom.WD01.Exception.ValidationException;
import org.wisdom.WD01.Reponsitory.RoleRepository;
import org.wisdom.WD01.Reponsitory.UserRepository;

import java.util.*;

@Component
@RequiredArgsConstructor
public class Validation {
    // Regex kiểm tra định dạng email: chấp nhận chữ, số, ký tự đặc biệt phổ biến và domain từ 2-6 ký tự.
    public static final String EMAIL_REGEX = "^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";
    // Regex quốc tế: Chấp nhận bắt đầu bằng + hoặc 0, dài từ 8-15 ký tự
    public static final String PHONE_REGEX = "^(\\+|0)[0-9]{7,14}$";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public void validationRegisterRequest(RegisterRequest req) {
        Map<String, String> errors = new LinkedHashMap<>();

        // Check null object
        if(ObjectUtils.isEmpty(req.getUsername())) {
            throw new IllegalArgumentException("Request body is missing");
        }

        // Validate username
        if(!StringUtils.hasText(req.getUsername())) {
            errors.put("username", "Username is required");
        }else if (req.getUsername().length() < 4 || req.getUsername().length() > 50) {
            errors.put("username", "Username must be between 4 and 50 characters");
        }else if(userRepository.existsByUsername(req.getUsername())) {
            errors.put("username", "Username already exists");
        }

        // Validate password
        if(!StringUtils.hasText(req.getPassword())) {
            errors.put("password", "Password is required");
        }else if (req.getPassword().length() < 6) {
            errors.put("password", "Password must be at least 6 characters long");
        }

        // Validate email
        if(!StringUtils.hasText(req.getEmail())) {
            errors.put("email", "Email is required");
        }else if (!req.getEmail().matches(EMAIL_REGEX)) {
            errors.put("email", "Invalid email format");
        }else if (userRepository.existsByEmail(req.getEmail())) {
            errors.put("email", "Email is already registered");
        }

        // Validate phone
        if(!StringUtils.hasText(req.getPhone())) {
            errors.put("phone", "Phone number is required");
        }else if (!req.getPhone().matches(PHONE_REGEX)) {
            errors.put("phone", "Invalid phone number format");
        }

        if(!CollectionUtils.isEmpty(errors)) {
            throw new ValidationException(errors);
        }
    }

    public void validateLogin(AuthRequest req) {
        Map<String, String> errors = new LinkedHashMap<>();

        if (ObjectUtils.isEmpty(req)) {
            throw new IllegalArgumentException("Login request body is missing");
        }

        // Check Username
        if (!StringUtils.hasText(req.getUsername())) {
            errors.put("username", "Username is required");
        }

        // Check Password
        if (!StringUtils.hasText(req.getPassword())) {
            errors.put("password", "Password is required");
        }

        // Throw ValidationException if have errors
        if (!CollectionUtils.isEmpty(errors)) {
            throw new ValidationException(errors);
        }
    }

    public void validateVerifyOtp(String email, String otp) {
        Map<String, String> errors = new LinkedHashMap<>();

        // Check email
        if (!StringUtils.hasText(email)) {
            errors.put("email", "Email is required");
        } else if (!email.matches(EMAIL_REGEX)) {
            errors.put("email", "Invalid email format");
        }
        // Check otp
        if (!StringUtils.hasText(otp)) {
            errors.put("otp", "OTP is required");
        } else if (otp.length() != 6) {
            errors.put("otp", "OTP must be exactly 6 digits");
        }
        // Throw ValidationException if have errors
        if (!CollectionUtils.isEmpty(errors)) {
            throw new ValidationException(errors);
        }
    }

    public void validateResetPassword(ResetPasswordRequest req) {
        Map<String, String> errors = new LinkedHashMap<>();
        // Check object empty
        if (ObjectUtils.isEmpty(req)) {
            throw new IllegalArgumentException("Request body is missing");
        }

        // Check Email
        if (!StringUtils.hasText(req.getEmail())) errors.put("email", "Email is required");

        // Check OTP
        if (!StringUtils.hasText(req.getOtp())) errors.put("otp", "OTP is required");

        // Check Password
        if (!StringUtils.hasText(req.getNewPassword())) {
            errors.put("newPassword", "New password is required");
        } else if (req.getNewPassword().length() < 6) {
            errors.put("newPassword", "Password must be at least 6 characters");
        }

        // Throw ValidationException if have errors
        if (!CollectionUtils.isEmpty(errors)) {
            throw new ValidationException(errors);
        }
    }
}
