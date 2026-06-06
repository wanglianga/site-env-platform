package com.site.env.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "review_evidence")
public class ReviewEvidence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @Column(name = "site_id")
    private Long siteId;

    private String evidenceType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    private String submitter;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        submittedAt = LocalDateTime.now();
    }
}
