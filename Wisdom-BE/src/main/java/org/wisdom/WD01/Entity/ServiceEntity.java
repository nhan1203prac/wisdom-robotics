package org.wisdom.WD01.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "services")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class ServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long id;

    /*
     * Company relationship
     */
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    /*
     * Category relationship (phục vụ search theo category)
     */
    @ManyToOne
    @JoinColumn(name = "category_id")
    private ServiceCategory category;

    /*
     * Service name
     */
    @NotNull
    @Size(max = 255)
    @Column(name = "service_name", nullable = false)
    private String serviceName;

    /*
     * Description từ text editor (HTML)
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /*
     * Thumbnail image
     */
    @Size(max = 500)
    @Column(name = "thumbnail")
    private String thumbnail;

    /*
     * Base price
     */
    @NotNull
    @Column(name = "base_price", precision = 12, scale = 2)
    private BigDecimal basePrice;

    /*
     * View count
     */
    @ColumnDefault("0")
    @Column(name = "view_count")
    private Integer viewCount = 0;

    /*
     * Search count
     */
    @ColumnDefault("0")
    @Column(name = "search_count")
    private Integer searchCount = 0;

    /*
     * Rating average
     */
    @ColumnDefault("0.00")
    @Column(name = "rating_avg", precision = 3, scale = 2)
    private BigDecimal ratingAvg = BigDecimal.ZERO;

    /*
     * Rating count
     */
    @ColumnDefault("0")
    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    /*
     * Created time
     */
    @Column(name = "created_at")
    private Instant createdAt;

    /*
     * Quan hệ 1-n với rating
     */
    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ServiceRating> ratings;


    // Thêm vào class ServiceEntity hiện có
    @Column(name = "duration_minutes")
    private Integer durationMinutes; // Ví dụ: 60 (phút)

    @Column(name = "deposit_price")
    private BigDecimal depositPrice; // Tiền đặt cọc

    @Column(name = "is_booking_service")
    private Boolean isBookingService = false; // Phân biệt với sản phẩm/dịch vụ thông thường
    /*
     * Auto set createdAt khi insert
     */
    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }
}