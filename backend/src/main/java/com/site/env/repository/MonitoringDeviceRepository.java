package com.site.env.repository;

import com.site.env.entity.DeviceStatus;
import com.site.env.entity.MonitoringDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MonitoringDeviceRepository extends JpaRepository<MonitoringDevice, Long> {
    List<MonitoringDevice> findBySiteId(Long siteId);
    List<MonitoringDevice> findByStatus(DeviceStatus status);
}
