package org.wisdom.WD01.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "employees")
public class Employee {

    // ================= EMPLOYEE ID =================
    @Id
    @Column(name = "employee_id", nullable = false, length = 20)
    @NotBlank(message = "Employee ID không được để trống")
    @Size(max = 20)
    private String employeeId;

    // ================= NAME =================
    @NotBlank(message = "Name không được để trống")
    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    // ================= EMAIL =================
    @Email(message = "Email không hợp lệ")
    @Size(max = 100)
    @Column(name = "email", length = 100)
    private String email;

    // ================= PHONE =================
    @NotBlank(message = "Phone không được để trống")
    @Size(max = 20)
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    // ================= STATUS =================
    @Size(max = 20)
    @Column(name = "status", length = 20)
    private String status = "ACTIVE";

    @ManyToOne
    @JoinColumn(name = "service_category_id")
    private ServiceCategory serviceCategory;

    // ================= CREATED TIME =================
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

}