package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Entity.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(String roleName);
}