package org.wisdom.WD01.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Ví dụ: "Software Development"

    private String description;

    private String icon;

    private boolean enabled = true;

    @OneToMany(mappedBy = "category")
    private List<Post> posts;
}
