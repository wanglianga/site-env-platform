package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService service;

    @GetMapping("/summary")
    public Result<Map<String, Object>> getSummary() {
        return Result.success(service.getSummary());
    }

    @GetMapping("/site/{siteId}")
    public Result<Map<String, Object>> getSiteDashboard(@PathVariable Long siteId) {
        return Result.success(service.getSiteDashboard(siteId));
    }
}
