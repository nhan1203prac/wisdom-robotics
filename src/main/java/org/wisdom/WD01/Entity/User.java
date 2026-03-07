package org.wisdom.WD01.Entity;  // package nên viết thường

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Builder  // tiện khi tạo object
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users",
        uniqueConstraints = @UniqueConstraint(columnNames = "username"))  // ← Bắt buộc để tránh duplicate username
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;

    @Size(max = 100)
    @NotBlank(message = "Username không được để trống")
    @Column(name = "username", nullable = false, length = 100, unique = true)
    private String username;

    @NotBlank(message = "Password không được để trống")
    @Column(name = "password", nullable = false)
    private String password;  // sẽ được encode trước khi save

    @Email(message = "Email không hợp lệ")
    @Size(max = 150)
    @Column(name = "email", length = 150)
    private String email;

    @Size(max = 50)
    @Column(name = "phone", length = 50)
    private String phone;

    @NotNull(message = "Role không được để trống")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @NotBlank(message = "Status không được để trống")
    @Size(max = 50)
    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE";  // default value


    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    // Optional: thêm field cho full name, avatar,... sau này
}