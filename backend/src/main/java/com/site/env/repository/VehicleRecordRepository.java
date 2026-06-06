package com.site.env.repository;

import com.site.env.entity.RecordType;
import com.site.env.entity.VehicleRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VehicleRecordRepository extends JpaRepository<VehicleRecord, Long> {
    List<VehicleRecord> findBySiteIdOrderByRecordTimeDesc(Long siteId);
    List<VehicleRecord> findByPlateNumberOrderByRecordTimeDesc(String plateNumber);
    List<VehicleRecord> findByRecordType(RecordType recordType);
    List<VehicleRecord> findByIsNightViolationTrue();

    @Query("SELECT v FROM VehicleRecord v WHERE v.siteId = :siteId AND v.recordTime BETWEEN :start AND :end ORDER BY v.recordTime DESC")
    List<VehicleRecord> findBySiteIdAndRecordTimeBetween(@Param("siteId") Long siteId,
                                                         @Param("start") LocalDateTime start,
                                                         @Param("end") LocalDateTime end);
}
