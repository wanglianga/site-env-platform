package com.site.env.service;

import com.site.env.entity.DustReading;
import com.site.env.repository.DustReadingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DustReadingService {

    private static final Logger log = LoggerFactory.getLogger(DustReadingService.class);

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

    public java.util.Map<String, Object> getStats(Long siteId) {
        List<DustReading> readings = (siteId != null) ? getBySiteId(siteId) : getAll();
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("count", readings.size());
        double pm25Avg = readings.stream().mapToDouble(r -> r.getPm25() != null ? r.getPm25() : 0).average().orElse(0);
        double pm10Avg = readings.stream().mapToDouble(r -> r.getPm10() != null ? r.getPm10() : 0).average().orElse(0);
        double tspAvg = readings.stream().mapToDouble(r -> r.getTsp() != null ? r.getTsp() : 0).average().orElse(0);
        long overlimitCount = readings.stream().filter(r -> r.getIsOverlimit() != null && r.getIsOverlimit()).count();
        result.put("pm25Avg", Math.round(pm25Avg * 10) / 10.0);
        result.put("pm10Avg", Math.round(pm10Avg * 10) / 10.0);
        result.put("tspAvg", Math.round(tspAvg * 10) / 10.0);
        result.put("overlimitCount", overlimitCount);
        return result;
    }

    public java.util.Map<String, Object> getTrend(Long siteId) {
        List<DustReading> readings = (siteId != null) ? getBySiteId(siteId) : getAll();
        java.util.Collections.sort(readings, (a, b) -> a.getReadingTime().compareTo(b.getReadingTime()));
        List<String> times = new java.util.ArrayList<>();
        List<Double> pm25 = new java.util.ArrayList<>();
        List<Double> pm10 = new java.util.ArrayList<>();
        List<Double> tsp = new java.util.ArrayList<>();
        for (DustReading r : readings) {
            times.add(r.getReadingTime().toString());
            pm25.add(r.getPm25() != null ? r.getPm25().doubleValue() : 0);
            pm10.add(r.getPm10() != null ? r.getPm10().doubleValue() : 0);
            tsp.add(r.getTsp() != null ? r.getTsp().doubleValue() : 0);
        }
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("times", times);
        result.put("pm25", pm25);
        result.put("pm10", pm10);
        result.put("tsp", tsp);
        return result;
    }

    public java.util.Map<String, Object> getOverlimitPaged(int page, int size) {
        List<DustReading> all = getOverlimitReadings();
        int from = Math.min((page - 1) * size, all.size());
        int to = Math.min(from + size, all.size());
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("list", all.subList(from, to));
        result.put("total", all.size());
        result.put("page", page);
        result.put("size", size);
        return result;
    }
}
