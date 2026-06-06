package com.site.env.service;

import com.site.env.entity.RecordType;
import com.site.env.entity.VehicleRecord;
import com.site.env.repository.VehicleRecordRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class VehicleRecordService {

    @Autowired
    private VehicleRecordRepository vehicleRecordRepository;

    public VehicleRecord create(VehicleRecord record) {
        log.info("创建车辆出入记录: plateNumber={}, type={}", record.getPlateNumber(), record.getRecordType());
        checkNightViolation(record);
        return vehicleRecordRepository.save(record);
    }

    private void checkNightViolation(VehicleRecord record) {
        LocalDateTime time = record.getRecordTime() != null ? record.getRecordTime() : LocalDateTime.now();
        int hour = time.getHour();
        boolean isNight = hour >= 22 || hour < 6;
        record.setIsNightViolation(isNight);
        if (isNight) {
            log.warn("夜间违规检测: plateNumber={}, time={}", record.getPlateNumber(), time);
        }
    }

    public Optional<VehicleRecord> getById(Long id) {
        return vehicleRecordRepository.findById(id);
    }

    public List<VehicleRecord> getAll() {
        return vehicleRecordRepository.findAll();
    }

    public List<VehicleRecord> getBySiteId(Long siteId) {
        return vehicleRecordRepository.findBySiteIdOrderByRecordTimeDesc(siteId);
    }

    public List<VehicleRecord> getByPlateNumber(String plateNumber) {
        return vehicleRecordRepository.findByPlateNumberOrderByRecordTimeDesc(plateNumber);
    }

    public List<VehicleRecord> getByRecordType(RecordType recordType) {
        return vehicleRecordRepository.findByRecordType(recordType);
    }

    public List<VehicleRecord> getNightViolations() {
        return vehicleRecordRepository.findByIsNightViolationTrue();
    }

    public List<VehicleRecord> getBySiteIdAndTimeRange(Long siteId, LocalDateTime start, LocalDateTime end) {
        return vehicleRecordRepository.findBySiteIdAndRecordTimeBetween(siteId, start, end);
    }

    public void delete(Long id) {
        log.info("删除车辆出入记录: id={}", id);
        vehicleRecordRepository.deleteById(id);
    }
}
