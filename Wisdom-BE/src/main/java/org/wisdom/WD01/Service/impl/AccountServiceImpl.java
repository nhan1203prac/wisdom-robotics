package org.wisdom.WD01.Service.impl;

import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.wisdom.WD01.Dto.CreateEmployeeAccountRequest;
import org.wisdom.WD01.Entity.Employee;
import org.wisdom.WD01.Entity.Role;
import org.wisdom.WD01.Entity.User;
import org.wisdom.WD01.Reponsitory.EmployeeRepository;
import org.wisdom.WD01.Reponsitory.RoleRepository;
import org.wisdom.WD01.Reponsitory.UserRepository;
import org.wisdom.WD01.Service.AccountService;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Force load role bằng cách truy cập trong transaction
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // Force init role (vì LAZY)
        Hibernate.initialize(user.getRole());

        // DEBUG
        System.out.println("Loaded user: " + username);
        System.out.println("Role object: " + user.getRole());
        System.out.println("Role name: " + (user.getRole() != null ? user.getRole().getRoleName() : "NULL ROLE"));

        String roleName = "USER";
        if (user.getRole() != null) {
            roleName = user.getRole().getRoleName().toUpperCase();
        }

        String roleWithPrefix = "ROLE_" + roleName;

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(roleWithPrefix)
                .accountLocked(!"ACTIVE".equals(user.getStatus()))
                .build();
    }
    @Override
    public void createEmployeeAccount(CreateEmployeeAccountRequest request) {

        if (userRepository.existsByUsername(request.getEmployeeId())) {
            throw new RuntimeException("Employee account already exists");
        }

        Role role = roleRepository.findByRoleName("EMPLOYEE")
                .orElseThrow(() -> new RuntimeException("Role EMPLOYEE not found"));

        Employee employee = employeeRepository.findByEmployeeId(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        User user = User.builder()
                .employee(employee)
                .username(request.getEmployeeId())
                .password(passwordEncoder.encode(request.getPhone()))
                .phone(request.getPhone())
                .email(request.getEmail())
                .role(role)
                .status("ACTIVE")
                .build();

        userRepository.save(user);
    }
}