package com.site.env.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
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
}
