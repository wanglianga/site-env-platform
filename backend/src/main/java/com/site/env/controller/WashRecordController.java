package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.WashRecord;
import com.site.env.entity.WashStatus;
import com.site.env.service.WashRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/wash-records")
@CrossOrigin(origins = "*")
public class WashRecordController {

    @Autowired
    private WashRecordService service;

    @GetMapping
    public Result<List<WashRecord>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<WashRecord> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "洗车记录不存在"));
    }

    @GetMapping("/site/{siteId}")
    public Result<List<WashRecord>> getBySiteId(@PathVariable Long siteId) {
        return Result.success(service.getBySiteId(siteId));
    }

    @GetMapping("/plate/{plateNumber}")
    public Result<List<WashRecord>> getByPlateNumber(@PathVariable String plateNumber) {
        return Result.success(service.getByPlateNumber(plateNumber));
    }

    @GetMapping("/status/{status}")
    public Result<List<WashRecord>> getByStatus(@PathVariable WashStatus status) {
        return Result.success(service.getByStatus(status));
    }

    @GetMapping("/unwashed")
    public Result<List<WashRecord>> getUnwashed() {
        return Result.success(service.getUnwashedRecords());
    }

    @GetMapping("/range")
    public Result<List<WashRecord>> getByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return Result.success(service.getByTimeRange(start, end));
    }

    @PostMapping
    public Result<WashRecord> create(@RequestBody WashRecord record) {
        return Result.success(service.create(record));
    }

    @PutMapping("/{id}/confirm")
    public Result<WashRecord> confirmWash(@PathVariable Long id) {
        try {
            return Result.success(service.confirmWash(id));
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
        return Result.error(404, "洗车记录不存在");
    }
}
