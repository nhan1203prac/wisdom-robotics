package org.wisdom.WD01.Config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.wisdom.WD01.Entity.Role;
import org.wisdom.WD01.Reponsitory.RoleRepository;

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking for default roles...");

        List<String> defaultRoles = Arrays.asList("ADMIN", "USER", "EMPLOYEE");

        // Create default list role when start project
        for(String roleName : defaultRoles) {
            // Create if role is not exists
            if(!roleRepository.existsByRoleName(roleName)) {
                Role role = new Role();
                role.setRoleName(roleName);
                roleRepository.save(role);
                log.info("Created default role: {}" + roleName);
            }
        }
    }
}
