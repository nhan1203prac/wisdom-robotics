package org.wisdom.WD01.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.Instant;
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
@Getter
@Setter
@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id", nullable = false)
    @JsonIgnore
    private User ownerUser;

    // Company name
    @Size(max = 255)
    @NotNull
    @Column(name = "company_name", nullable = false)
    private String companyName;

    // Tax code
    @Size(max = 50)
    @Column(name = "tax_code", length = 50)
    private String taxCode;

    // Founded year
    @Column(name = "founded_year")
    private Integer foundedYear;

    // Logo
    @Size(max = 255)
    @Column(name = "logo_url")
    private String logoUrl;

    // Created time
    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}