package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.EarthworkPlan;
import com.site.env.service.EarthworkPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/earthwork-plans")
@CrossOrigin(origins = "*")
public class EarthworkPlanController {

    @Autowired
    private EarthworkPlanService service;

    @GetMapping
    public Result<List<EarthworkPlan>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<EarthworkPlan> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "土方计划不存在"));
    }

    @GetMapping("/site/{siteId}")
    public Result<List<EarthworkPlan>> getBySiteId(@PathVariable Long siteId) {
        return Result.success(service.getBySiteId(siteId));
    }

    @GetMapping("/date/{planDate}")
    public Result<List<EarthworkPlan>> getByPlanDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate planDate) {
        return Result.success(service.getByPlanDate(planDate));
    }

    @GetMapping("/night-work")
    public Result<List<EarthworkPlan>> getNightWorkPlans() {
        return Result.success(service.getNightWorkPlans());
    }

    @PostMapping
    public Result<EarthworkPlan> create(@RequestBody EarthworkPlan plan) {
        return Result.success(service.create(plan));
    }

    @PutMapping("/{id}")
    public Result<EarthworkPlan> update(@PathVariable Long id, @RequestBody EarthworkPlan plan) {
        try {
            return Result.success(service.update(id, plan));
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
        return Result.error(404, "土方计划不存在");
    }
}
