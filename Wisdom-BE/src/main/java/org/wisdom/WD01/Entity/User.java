package org.wisdom.WD01.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "employee_id")
        })
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;

    // ================= EMPLOYEE ID =================
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    // ================= USERNAME =================
    @Size(max = 100)
    @NotBlank(message = "Username không được để trống")
    @Column(name = "username", nullable = false, length = 100, unique = true)
    private String username;

    // ================= PASSWORD =================
    @NotBlank(message = "Password không được để trống")
    @Column(name = "password", nullable = false)
    private String password;

    // ================= EMAIL =================
    @Email(message = "Email không hợp lệ")
    @Size(max = 150)
    @Column(name = "email", length = 150)
    private String email;

    // ================= PHONE =================
    @Size(max = 50)
    @Column(name = "phone", length = 50)
    private String phone;

    // ================= ROLE =================
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    // ================= STATUS =================
    @NotBlank(message = "Status không được để trống")
    @Size(max = 50)
    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE";

    // ================= CREATED TIME =================
    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();


}