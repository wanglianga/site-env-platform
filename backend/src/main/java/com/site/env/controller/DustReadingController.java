package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.DustReading;
import com.site.env.service.DustReadingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/dust-readings")
@CrossOrigin(origins = "*")
public class DustReadingController {

    @Autowired
    private DustReadingService service;

    @GetMapping
    public Result<List<DustReading>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<DustReading> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "扬尘读数不存在"));
    }

    @GetMapping("/site/{siteId}")
    public Result<List<DustReading>> getBySiteId(@PathVariable Long siteId) {
        return Result.success(service.getBySiteId(siteId));
    }

    @GetMapping("/site/{siteId}/range")
    public Result<List<DustReading>> getBySiteIdAndRange(
            @PathVariable Long siteId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return Result.success(service.getBySiteIdAndTimeRange(siteId, start, end));
    }

    @GetMapping("/site/{siteId}/latest")
    public Result<List<DustReading>> getLatestBySiteId(
            @PathVariable Long siteId,
            @RequestParam(defaultValue = "10") int limit) {
        return Result.success(service.getLatestBySiteId(siteId, limit));
    }

    @GetMapping("/overlimit")
    public Result<List<DustReading>> getOverlimit() {
        return Result.success(service.getOverlimitReadings());
    }

    @PostMapping
    public Result<DustReading> create(@RequestBody DustReading reading) {
        return Result.success(service.create(reading));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        if (service.getById(id).isPresent()) {
            service.delete(id);
            return Result.success(null);
        }
        return Result.error(404, "扬尘读数不存在");
    }
}
