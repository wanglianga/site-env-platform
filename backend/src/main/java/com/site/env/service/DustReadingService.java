package com.site.env.service;

import com.site.env.entity.DustReading;
import com.site.env.repository.DustReadingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class DustReadingService {

    @Autowired
    private DustReadingRepository dustReadingRepository;

    public DustReading create(DustReading reading) {
        log.info("创建扬尘读数: siteId={}", reading.getSiteId());
        checkOverlimit(reading);
        return dustReadingRepository.save(reading);
    }

    private void checkOverlimit(DustReading reading) {
        boolean overlimit = false;
        StringBuilder typeBuilder = new StringBuilder();
        if (reading.getPm25() != null && reading.getPm25() > 75) {
            overlimit = true;
            typeBuilder.append("PM2.5 ");
        }
        if (reading.getPm10() != null && reading.getPm10() > 150) {
            overlimit = true;
            typeBuilder.append("PM10 ");
        }
        if (reading.getTsp() != null && reading.getTsp() > 300) {
            overlimit = true;
            typeBuilder.append("TSP ");
        }
        reading.setIsOverlimit(overlimit);
        if (overlimit) {
            reading.setOverlimitType(typeBuilder.toString().trim());
            log.warn("扬尘超标告警: siteId={}, type={}", reading.getSiteId(), reading.getOverlimitType());
        }
    }

    public Optional<DustReading> getById(Long id) {
        return dustReadingRepository.findById(id);
    }

    public List<DustReading> getBySiteId(Long siteId) {
        return dustReadingRepository.findBySiteIdOrderByReadingTimeDesc(siteId);
    }

    public List<DustReading> getBySiteIdAndTimeRange(Long siteId, LocalDateTime start, LocalDateTime end) {
        return dustReadingRepository.findBySiteIdAndReadingTimeBetween(siteId, start, end);
    }

    public List<DustReading> getOverlimitReadings() {
        return dustReadingRepository.findByIsOverlimitTrue();
    }

    public List<DustReading> getLatestBySiteId(Long siteId, int limit) {
        return dustReadingRepository.findLatestBySiteId(siteId, PageRequest.of(0, limit));
    }

    public List<DustReading> getAll() {
        return dustReadingRepository.findAll();
    }

    public void delete(Long id) {
        log.info("删除扬尘读数: id={}", id);
        dustReadingRepository.deleteById(id);
    }
}
