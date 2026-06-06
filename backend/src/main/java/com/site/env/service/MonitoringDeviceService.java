package com.site.env.service;

import com.site.env.entity.DeviceStatus;
import com.site.env.entity.MonitoringDevice;
import com.site.env.repository.MonitoringDeviceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MonitoringDeviceService {

    private static final int OFFLINE_THRESHOLD_MINUTES = 30;

    @Autowired
    private MonitoringDeviceRepository monitoringDeviceRepository;

    public MonitoringDevice create(MonitoringDevice device) {
        log.info("创建设备: siteId={}, deviceCode={}", device.getSiteId(), device.getDeviceCode());
        if (device.getStatus() == null) {
            device.setStatus(DeviceStatus.ONLINE);
        }
        return monitoringDeviceRepository.save(device);
    }

    public MonitoringDevice updateHeartbeat(Long id) {
        log.info("更新设备心跳: id={}", id);
        return monitoringDeviceRepository.findById(id)
                .map(device -> {
                    device.setLastHeartbeat(LocalDateTime.now());
                    device.setStatus(DeviceStatus.ONLINE);
                    return monitoringDeviceRepository.save(device);
                })
                .orElseThrow(() -> new RuntimeException("设备不存在: " + id));
    }

    public List<MonitoringDevice> detectOffline() {
        log.info("检测离线设备");
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(OFFLINE_THRESHOLD_MINUTES);
        List<MonitoringDevice> allDevices = monitoringDeviceRepository.findAll();
        List<MonitoringDevice> offlineDevices = allDevices.stream()
                .filter(d -> d.getLastHeartbeat() == null || d.getLastHeartbeat().isBefore(threshold))
                .filter(d -> d.getStatus() != DeviceStatus.OFFLINE)
                .peek(d -> {
                    d.setStatus(DeviceStatus.OFFLINE);
                    monitoringDeviceRepository.save(d);
                    log.warn("设备离线: id={}, deviceCode={}", d.getId(), d.getDeviceCode());
                })
                .collect(Collectors.toList());
        return offlineDevices;
    }

    public Optional<MonitoringDevice> getById(Long id) {
        return monitoringDeviceRepository.findById(id);
    }

    public Optional<MonitoringDevice> findById(Long id) {
        return getById(id);
    }

    public List<MonitoringDevice> getAll() {
        return monitoringDeviceRepository.findAll();
    }

    public List<MonitoringDevice> findAll() {
        return getAll();
    }

    public List<MonitoringDevice> getBySiteId(Long siteId) {
        return monitoringDeviceRepository.findBySiteId(siteId);
    }

    public List<MonitoringDevice> findBySiteId(Long siteId) {
        return getBySiteId(siteId);
    }

    public List<MonitoringDevice> getByStatus(DeviceStatus status) {
        return monitoringDeviceRepository.findByStatus(status);
    }

    public List<MonitoringDevice> findByStatus(DeviceStatus status) {
        return getByStatus(status);
    }

    public List<MonitoringDevice> getOnlineDevices() {
        return monitoringDeviceRepository.findByStatus(DeviceStatus.ONLINE);
    }

    public List<MonitoringDevice> getOfflineDevices() {
        return monitoringDeviceRepository.findByStatus(DeviceStatus.OFFLINE);
    }

    public MonitoringDevice update(Long id, MonitoringDevice device) {
        log.info("更新设备: id={}", id);
        return monitoringDeviceRepository.findById(id)
                .map(existing -> {
                    existing.setSiteId(device.getSiteId());
                    existing.setDeviceCode(device.getDeviceCode());
                    existing.setDeviceName(device.getDeviceName());
                    existing.setStatus(device.getStatus());
                    existing.setPm25Threshold(device.getPm25Threshold());
                    existing.setPm10Threshold(device.getPm10Threshold());
                    existing.setTspThreshold(device.getTspThreshold());
                    return monitoringDeviceRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("设备不存在: " + id));
    }

    public void delete(Long id) {
        log.info("删除设备: id={}", id);
        monitoringDeviceRepository.deleteById(id);
    }

    public void deleteById(Long id) {
        delete(id);
    }

    public MonitoringDevice save(MonitoringDevice device) {
        if (device.getId() == null) {
            return create(device);
        }
        log.info("保存设备: id={}", device.getId());
        return monitoringDeviceRepository.save(device);
    }
}
