package org.wisdom.WD01.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.wisdom.WD01.Dto.ApiResponse;
import org.wisdom.WD01.Dto.AuthRequest;
import org.wisdom.WD01.Dto.AuthResponse;
import org.wisdom.WD01.Dto.RegisterRequest;
import org.wisdom.WD01.Entity.Role;
import org.wisdom.WD01.Entity.User;
import org.wisdom.WD01.Reponsitory.RoleRepository;
import org.wisdom.WD01.Reponsitory.UserRepository;
import org.wisdom.WD01.Service.AccountService;
import org.wisdom.WD01.Service.JwtService;

import java.time.Instant;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AccountService accountService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest req) {

        if (userRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, "Username already exists"));
        }

        Role role = roleRepository.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

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
                new ApiResponse(true, "Register success")
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getUsername(), req.getPassword()
                )
        );

        UserDetails userDetails =
                accountService.loadUserByUsername(req.getUsername());

        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(token));
    }
}