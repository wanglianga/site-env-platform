package com.site.env.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSiteId() {
        return siteId;
    }

    public void setSiteId(Long siteId) {
        this.siteId = siteId;
    }

    public String getPlateNumber() {
        return plateNumber;
    }

    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    public LocalDateTime getWashStart() {
        return washStart;
    }

    public void setWashStart(LocalDateTime washStart) {
        this.washStart = washStart;
    }

    public LocalDateTime getWashEnd() {
        return washEnd;
    }

    public void setWashEnd(LocalDateTime washEnd) {
        this.washEnd = washEnd;
    }

    public Integer getWashDuration() {
        return washDuration;
    }

    public void setWashDuration(Integer washDuration) {
        this.washDuration = washDuration;
    }

    public WashStatus getStatus() {
        return status;
    }

    public void setStatus(WashStatus status) {
        this.status = status;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getBeforeImageUrl() {
        return beforeImageUrl;
    }

    public void setBeforeImageUrl(String beforeImageUrl) {
        this.beforeImageUrl = beforeImageUrl;
    }

    public String getAfterImageUrl() {
        return afterImageUrl;
    }

    public void setAfterImageUrl(String afterImageUrl) {
        this.afterImageUrl = afterImageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
