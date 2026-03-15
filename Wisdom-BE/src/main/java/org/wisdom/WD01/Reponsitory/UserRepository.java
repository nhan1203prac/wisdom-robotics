package org.wisdom.WD01.Reponsitory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.wisdom.WD01.Entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}