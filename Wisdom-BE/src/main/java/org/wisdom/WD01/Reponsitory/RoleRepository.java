package org.wisdom.WD01.Reponsitory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Entity.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(String roleName);

    boolean existsByRoleName(@Size(max = 50) @NotBlank(message = "Tên role không được để trống") String roleName);
}