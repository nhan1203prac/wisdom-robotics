package org.wisdom.WD01.Dto.Response;

import lombok.Builder;
import lombok.Data;
import org.wisdom.WD01.Entity.Role;

import java.time.Instant;

@Data
@Builder
public class UserResponse {
    private Long id;

    private String username;

    private String email;

    private String phone;

    private String role;

    private String status = "ACTIVE";

    private Instant createdAt = Instant.now();

}
