package org.wisdom.WD01.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.wisdom.WD01.Enum.ReactionType;

import java.time.Instant;

@Entity
@Table(name = "post_reactions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostReaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "react_id", nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ReactionType type; // LIKE hoặc DISLIKE

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    private Instant createdAt = Instant.now();
}