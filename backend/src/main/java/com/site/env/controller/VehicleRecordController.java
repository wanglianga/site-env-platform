package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.RecordType;
import com.site.env.entity.VehicleRecord;
import com.site.env.service.VehicleRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vehicle-records")
@CrossOrigin(origins = "*")
public class VehicleRecordController {

    @Autowired
    private VehicleRecordService service;

    @GetMapping
    public Result<List<VehicleRecord>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<VehicleRecord> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "车辆记录不存在"));
    }

    @GetMapping("/site/{siteId}")
    public Result<List<VehicleRecord>> getBySiteId(@PathVariable Long siteId) {
        return Result.success(service.getBySiteId(siteId));
    }

    @GetMapping("/plate/{plateNumber}")
    public Result<List<VehicleRecord>> getByPlateNumber(@PathVariable String plateNumber) {
        return Result.success(service.getByPlateNumber(plateNumber));
    }

    @GetMapping("/site/{siteId}/range")
    public Result<List<VehicleRecord>> getBySiteIdAndRange(
            @PathVariable Long siteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return Result.success(service.getBySiteIdAndTimeRange(siteId, start, end));
    }

    @GetMapping("/type/{recordType}")
    public Result<List<VehicleRecord>> getByRecordType(@PathVariable RecordType recordType) {
        return Result.success(service.getByRecordType(recordType));
    }

    @GetMapping("/night-violations")
    public Result<List<VehicleRecord>> getNightViolations() {
        return Result.success(service.getNightViolations());
    }

    @PostMapping
    public Result<VehicleRecord> create(@RequestBody VehicleRecord record) {
        return Result.success(service.create(record));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        if (service.getById(id).isPresent()) {
            service.delete(id);
            return Result.success(null);
        }
        return Result.error(404, "车辆记录不存在");
    }
}
