package org.wisdom.WD01.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id", nullable = false)
    private Long id;

    @Size(max = 50)
    @NotBlank(message = "Tên role không được để trống")
    @Column(name = "role_name", nullable = false, length = 50, unique = true)
    private String roleName;
}