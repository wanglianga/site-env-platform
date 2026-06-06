package com.site.env.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "wash_record")
public class WashRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_id", nullable = false)
    private Long siteId;

    @Column(nullable = false)
    private String plateNumber;

    @Column(name = "wash_start")
    private LocalDateTime washStart;

    @Column(name = "wash_end")
    private LocalDateTime washEnd;

    private Integer washDuration;

    @Enumerated(EnumType.STRING)
    private WashStatus status;

    private String operator;

    private String beforeImageUrl;

    private String afterImageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
