package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.ReviewEvidence;
import com.site.env.service.ReviewEvidenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review-evidences")
@CrossOrigin(origins = "*")
public class ReviewEvidenceController {

    @Autowired
    private ReviewEvidenceService service;

    @GetMapping
    public Result<List<ReviewEvidence>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<ReviewEvidence> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "复查证据不存在"));
    }

    @GetMapping("/task/{taskId}")
    public Result<List<ReviewEvidence>> getByTaskId(@PathVariable Long taskId) {
        return Result.success(service.getByTaskId(taskId));
    }

    @GetMapping("/site/{siteId}")
    public Result<List<ReviewEvidence>> getBySiteId(@PathVariable Long siteId) {
        return Result.success(service.getBySiteId(siteId));
    }

    @PostMapping
    public Result<ReviewEvidence> create(@RequestBody ReviewEvidence evidence) {
        return Result.success(service.upload(evidence));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        if (service.getById(id).isPresent()) {
            service.delete(id);
            return Result.success(null);
        }
        return Result.error(404, "复查证据不存在");
    }
}
