package org.wisdom.WD01.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_user_id", nullable = false)
    private User ownerUser;

    @Size(max = 255)
    @NotNull
    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Size(max = 50)
    @Column(name = "tax_code", length = 50)
    private String taxCode;

    @Column(name = "founded_year")
    private Integer foundedYear;

    @Size(max = 255)
    @Column(name = "logo_url")
    private String logoUrl;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}