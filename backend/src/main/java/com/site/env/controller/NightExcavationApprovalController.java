package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.NightApprovalStatus;
import com.site.env.entity.NightExcavationApproval;
import com.site.env.service.NightExcavationApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/night-excavation-approvals")
@CrossOrigin(origins = "*")
public class NightExcavationApprovalController {

    @Autowired
    private NightExcavationApprovalService service;

    @GetMapping
    public Result<List<NightExcavationApproval>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<NightExcavationApproval> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "夜间出土审批不存在"));
    }

    @GetMapping("/site/{siteId}")
    public Result<List<NightExcavationApproval>> getBySiteId(@PathVariable Long siteId) {
        return Result.success(service.getBySiteId(siteId));
    }

    @GetMapping("/status/{status}")
    public Result<List<NightExcavationApproval>> getByStatus(@PathVariable NightApprovalStatus status) {
        return Result.success(service.getByStatus(status));
    }

    @GetMapping("/site/{siteId}/date/{workDate}")
    public Result<List<NightExcavationApproval>> getBySiteIdAndWorkDate(
            @PathVariable Long siteId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate) {
        return Result.success(service.getBySiteIdAndWorkDate(siteId, workDate));
    }

    @PostMapping
    public Result<NightExcavationApproval> create(@RequestBody NightExcavationApproval approval) {
        return Result.success(service.create(approval));
    }

    @PutMapping("/{id}")
    public Result<NightExcavationApproval> update(@PathVariable Long id, @RequestBody NightExcavationApproval approval) {
        try {
            return Result.success(service.update(id, approval));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    @PutMapping("/{id}/approve")
    public Result<NightExcavationApproval> approve(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String reviewer = body.getOrDefault("reviewer", "系统管理员");
            String comment = body.get("comment");
            return Result.success(service.approve(id, reviewer, comment));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public Result<NightExcavationApproval> reject(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String reviewer = body.getOrDefault("reviewer", "系统管理员");
            String comment = body.get("comment");
            return Result.success(service.reject(id, reviewer, comment));
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
        return Result.error(404, "夜间出土审批不存在");
    }
}
