package com.site.env.service;

import com.site.env.entity.WashRecord;
import com.site.env.entity.WashStatus;
import com.site.env.repository.WashRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WashRecordService {

    private static final Logger log = LoggerFactory.getLogger(WashRecordService.class);

    @Autowired
    private WashRecordRepository washRecordRepository;

    public WashRecord create(WashRecord record) {
        log.info("创建冲洗记录: plateNumber={}", record.getPlateNumber());
        calculateDuration(record);
        return washRecordRepository.save(record);
    }

    private void calculateDuration(WashRecord record) {
        if (record.getWashStart() != null && record.getWashEnd() != null) {
            long minutes = Duration.between(record.getWashStart(), record.getWashEnd()).toMinutes();
            record.setWashDuration((int) minutes);
            if (minutes >= 3) {
                record.setStatus(WashStatus.WASHED);
            } else {
                record.setStatus(WashStatus.UNWASHED);
                log.warn("未冲洗检测: plateNumber={}, duration={}分钟", record.getPlateNumber(), minutes);
            }
        }
    }

    public WashRecord confirmWash(Long id) {
        log.info("确认冲洗: id={}", id);
        return washRecordRepository.findById(id)
                .map(record -> {
                    record.setStatus(WashStatus.WASHED);
                    if (record.getWashEnd() == null) {
                        record.setWashEnd(LocalDateTime.now());
                    }
                    calculateDuration(record);
                    return washRecordRepository.save(record);
                })
                .orElseThrow(() -> new RuntimeException("冲洗记录不存在: " + id));
    }

    public Optional<WashRecord> getById(Long id) {
        return washRecordRepository.findById(id);
    }

    public List<WashRecord> getAll() {
        return washRecordRepository.findAll();
    }

    public List<WashRecord> getBySiteId(Long siteId) {
        return washRecordRepository.findBySiteIdOrderByCreatedAtDesc(siteId);
    }

    public List<WashRecord> getByPlateNumber(String plateNumber) {
        return washRecordRepository.findByPlateNumberOrderByCreatedAtDesc(plateNumber);
    }

    public List<WashRecord> getByStatus(WashStatus status) {
        return washRecordRepository.findByStatus(status);
    }

    public List<WashRecord> getUnwashedRecords() {
        return washRecordRepository.findByStatus(WashStatus.UNWASHED);
    }

    public List<WashRecord> getByTimeRange(LocalDateTime start, LocalDateTime end) {
        return washRecordRepository.findByWashStartBetween(start, end);
    }

    public void delete(Long id) {
        log.info("删除冲洗记录: id={}", id);
        washRecordRepository.deleteById(id);
    }
}
