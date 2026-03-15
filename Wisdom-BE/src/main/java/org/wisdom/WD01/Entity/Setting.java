package org.wisdom.WD01.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "settings")
public class Setting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "setting_id", nullable = false)
    private Long id;

    @Size(max = 100)
    @NotNull
    @Column(name = "setting_key", nullable = false, length = 100)
    private String settingKey;

    @NotNull
    @Lob
    @Column(name = "setting_value", nullable = false)
    private String settingValue;

}