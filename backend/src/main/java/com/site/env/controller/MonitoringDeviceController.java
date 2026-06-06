package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.DeviceStatus;
import com.site.env.entity.MonitoringDevice;
import com.site.env.service.MonitoringDeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "*")
public class MonitoringDeviceController {

    @Autowired
    private MonitoringDeviceService service;

    @GetMapping
    public Result<List<MonitoringDevice>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<MonitoringDevice> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "监测设备不存在"));
    }

    @GetMapping("/site/{siteId}")
    public Result<List<MonitoringDevice>> getBySiteId(@PathVariable Long siteId) {
        return Result.success(service.getBySiteId(siteId));
    }

    @GetMapping("/status/{status}")
    public Result<List<MonitoringDevice>> getByStatus(@PathVariable DeviceStatus status) {
        return Result.success(service.getByStatus(status));
    }

    @GetMapping("/online")
    public Result<List<MonitoringDevice>> getOnline() {
        return Result.success(service.getOnlineDevices());
    }

    @GetMapping("/offline")
    public Result<List<MonitoringDevice>> getOffline() {
        return Result.success(service.getOfflineDevices());
    }

    @GetMapping("/detect-offline")
    public Result<List<MonitoringDevice>> detectOffline() {
        return Result.success(service.detectOffline());
    }

    @PostMapping
    public Result<MonitoringDevice> create(@RequestBody MonitoringDevice device) {
        return Result.success(service.create(device));
    }

    @PutMapping("/{id}")
    public Result<MonitoringDevice> update(@PathVariable Long id, @RequestBody MonitoringDevice device) {
        try {
            return Result.success(service.update(id, device));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    @PutMapping("/{id}/heartbeat")
    public Result<MonitoringDevice> heartbeat(@PathVariable Long id) {
        try {
            return Result.success(service.updateHeartbeat(id));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        if (service.getById(id).isPresent()) {
            service.delete(id);
            return Result.success(null);
        }
        return Result.error(404, "监测设备不存在");
    }
}
