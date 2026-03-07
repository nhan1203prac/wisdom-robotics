package org.wisdom.WD01.Controller;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.*;
import org.wisdom.WD01.Entity.Role;
import org.wisdom.WD01.Entity.User;
import org.wisdom.WD01.Exception.AppException;
import org.wisdom.WD01.Reponsitory.RoleRepository;
import org.wisdom.WD01.Reponsitory.UserRepository;
import org.wisdom.WD01.Service.AccountService;
import org.wisdom.WD01.Service.EmailService;
import org.wisdom.WD01.Service.JwtService;
import org.wisdom.WD01.Service.OtpStorageService;
import org.wisdom.WD01.Util.OtpUtil;
import org.wisdom.WD01.Util.Validation;

import java.time.Instant;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final Validation validation;
    private final OtpStorageService otpStorageService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest req) {
        // Validate request
        validation.validationRegisterRequest(req);

        // Fetch default user role from database
        Role role = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new AppException("System configuration error: Default role not found"));

        // Map DTO to Entity and encrypt password
        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setRole(role);
        user.setStatus("ACTIVE");
        user.setCreatedAt(Instant.now());


        userRepository.save(user);

        return ResponseEntity.ok(
                new ApiResponse(true, "Registration successful", null)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody AuthRequest req) {
        // Validate request body
        validation.validateLogin(req);

        try {
            // Perform authentication using Spring Security's AuthenticationManager
            // This will internally call UserDetailsService.loadUserByUsername()
            // and check the password against the stored BCrypt hash.
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );

            // If authentication is successful, retrieve user details from the principal
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Generate a JWT access token for the authenticated user
            String token = jwtService.generateToken(userDetails);

            // Create HttpOnly Cookie
            ResponseCookie jwtCookie = ResponseCookie.from("accessToken", token)
                    .httpOnly(true) // Prevent Javascript access
                    .secure(false) // Only allow when access through https
                    .maxAge(24 * 60 * 60)
                    .sameSite("Strict")
            .build();

            // Return success response with the JWT token
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(new ApiResponse<>(true, "Login successful", null));

        } catch (BadCredentialsException e) {
            // Handle case where password does not match or user is not found
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid username or password!", null));

        } catch (DisabledException e) {
            // Handle case where user account is disabled (e.g., status != ACTIVE)
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse(false, "Your account is currently disabled or locked!", null));

        }
    }

    @PostMapping("/send-reset-token")
    @Transactional
    public ResponseEntity<ApiResponse> sendResetToken(@RequestParam String email) {
        // Check email is exist
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Email not found"));

        // Create otp code 6 number
        String otp = OtpUtil.generateOtp();
        // Save otp
        otpStorageService.saveOtp(email, otp);
        // Send email to client
        emailService.sendEmail(user.getEmail(),
                "Reset Password - Wisdom Robotics",
                "Your verification code is: " + otp + ". It is valid for 10 minutes.");

        return ResponseEntity.ok(new ApiResponse(true, "OTP has been sent to your email", null));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@RequestBody VerifyOtpRequest req) {
        // Validate request
        validation.validateVerifyOtp(req.getEmail(), req.getOtp());
        // Get otp and verify
        String storedOtp = otpStorageService.getOtp(req.getEmail(), true);

        if (storedOtp == null || !storedOtp.equals(req.getOtp())) {
            throw new AppException("Invalid or expired OTP");
        }

        // If the code is correct, return success so the frontend can move to the "Enter new password" screen.
        return ResponseEntity.ok(new ApiResponse(true, "OTP verified successfully", null));
    }

        @PostMapping("/reset-password")
        public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest req) {
            // Validate request
            validation.validateResetPassword(req);
            // Double-check the OTP to ensure the security of the API.
            String storedOtp = otpStorageService.getOtp(req.getEmail(), false);

            if (storedOtp == null || !storedOtp.equals(req.getOtp())) {
                throw new AppException("Invalid or expired OTP");
            }
            // Find user and update password
            User user = userRepository.findByEmail(req.getEmail())
                    .orElseThrow(() -> new AppException("User not found"));

            user.setPassword(passwordEncoder.encode(req.getNewPassword()));
            userRepository.save(user);
            // Remove otp from Map after use
            otpStorageService.deleteOtp(req.getEmail());

            return ResponseEntity.ok(new ApiResponse(true, "Password updated successfully", null));
        }

}