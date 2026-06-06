package com.site.env.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_record")
public class VehicleRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_id", nullable = false)
    private Long siteId;

    @Column(nullable = false)
    private String plateNumber;

    @Enumerated(EnumType.STRING)
    private RecordType recordType;

    @Column(name = "record_time")
    private LocalDateTime recordTime;

    private String captureImageUrl;

    @Enumerated(EnumType.STRING)
    private WashStatus washStatus;

    private Boolean isNightViolation;

    private String remark;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (recordTime == null) {
            recordTime = LocalDateTime.now();
        }
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

    public RecordType getRecordType() {
        return recordType;
    }

    public void setRecordType(RecordType recordType) {
        this.recordType = recordType;
    }

    public LocalDateTime getRecordTime() {
        return recordTime;
    }

    public void setRecordTime(LocalDateTime recordTime) {
        this.recordTime = recordTime;
    }

    public String getCaptureImageUrl() {
        return captureImageUrl;
    }

    public void setCaptureImageUrl(String captureImageUrl) {
        this.captureImageUrl = captureImageUrl;
    }

    public WashStatus getWashStatus() {
        return washStatus;
    }

    public void setWashStatus(WashStatus washStatus) {
        this.washStatus = washStatus;
    }

    public Boolean getIsNightViolation() {
        return isNightViolation;
    }

    public void setIsNightViolation(Boolean isNightViolation) {
        this.isNightViolation = isNightViolation;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
