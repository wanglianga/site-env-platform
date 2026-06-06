package com.site.env.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "dust_reading")
public class DustReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "site_id", nullable = false)
    private Long siteId;

    @Column(name = "device_id")
    private Long deviceId;

    private Double pm25;

    private Double pm10;

    private Double tsp;

    private Double temperature;

    private Double humidity;

    private Double windSpeed;

    private Boolean isOverlimit;

    private String overlimitType;

    @Column(name = "reading_time")
    private LocalDateTime readingTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (readingTime == null) {
            readingTime = LocalDateTime.now();
        }
    }
}
