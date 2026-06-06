package com.site.env.repository;

import com.site.env.entity.WashRecord;
import com.site.env.entity.WashStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WashRecordRepository extends JpaRepository<WashRecord, Long> {
    List<WashRecord> findBySiteIdOrderByCreatedAtDesc(Long siteId);
    List<WashRecord> findByPlateNumberOrderByCreatedAtDesc(String plateNumber);
    List<WashRecord> findByStatus(WashStatus status);
    List<WashRecord> findByWashStartBetween(LocalDateTime start, LocalDateTime end);
}
