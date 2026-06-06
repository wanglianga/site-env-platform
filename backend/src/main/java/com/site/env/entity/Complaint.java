package com.site.env.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "complaint")
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_id")
    private Long siteId;

    private String complainant;

    private String complainantPhone;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String screenshotUrl;

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status;

    private String handler;

    @Column(name = "dispatched_at")
    private LocalDateTime dispatchedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Column(columnDefinition = "TEXT")
    private String processResult;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
