package com.site.env.repository;

import com.site.env.entity.DustReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DustReadingRepository extends JpaRepository<DustReading, Long> {
    List<DustReading> findBySiteIdOrderByReadingTimeDesc(Long siteId);

    @Query("SELECT d FROM DustReading d WHERE d.siteId = :siteId AND d.readingTime BETWEEN :start AND :end ORDER BY d.readingTime")
    List<DustReading> findBySiteIdAndReadingTimeBetween(@Param("siteId") Long siteId,
                                                        @Param("start") LocalDateTime start,
                                                        @Param("end") LocalDateTime end);

    List<DustReading> findByIsOverlimitTrue();

    @Query("SELECT d FROM DustReading d WHERE d.siteId = :siteId ORDER BY d.readingTime DESC")
    List<DustReading> findLatestBySiteId(@Param("siteId") Long siteId, org.springframework.data.domain.Pageable pageable);
}
