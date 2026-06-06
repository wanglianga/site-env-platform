package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.RectificationStatus;
import com.site.env.entity.RectificationTask;
import com.site.env.service.RectificationTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rectification-tasks")
@CrossOrigin(origins = "*")
public class RectificationTaskController {

    @Autowired
    private RectificationTaskService service;

    @GetMapping
    public Result<List<RectificationTask>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<RectificationTask> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "整改任务不存在"));
    }

    @GetMapping("/site/{siteId}")
    public Result<List<RectificationTask>> getBySiteId(@PathVariable Long siteId) {
        return Result.success(service.getBySiteId(siteId));
    }

    @GetMapping("/status/{status}")
    public Result<List<RectificationTask>> getByStatus(@PathVariable RectificationStatus status) {
        return Result.success(service.getByStatus(status));
    }

    @GetMapping("/person/{person}")
    public Result<List<RectificationTask>> getByPerson(@PathVariable String person) {
        return Result.success(service.getByRectificationPerson(person));
    }

    @GetMapping("/overdue")
    public Result<List<RectificationTask>> getOverdue() {
        return Result.success(service.detectOverdue());
    }

    @PostMapping
    public Result<RectificationTask> create(@RequestBody RectificationTask task) {
        return Result.success(service.create(task));
    }

    @PutMapping("/{id}")
    public Result<RectificationTask> update(@PathVariable Long id, @RequestBody RectificationTask task) {
        try {
            return Result.success(service.update(id, task));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    @PutMapping("/{id}/submit")
    public Result<RectificationTask> submit(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        try {
            String remark = body != null ? body.get("remark") : null;
            return Result.success(service.submit(id, remark));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    @PutMapping("/{id}/review")
    public Result<RectificationTask> review(@PathVariable Long id, @RequestParam boolean passed) {
        try {
            return Result.success(service.review(id, passed));
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
        return Result.error(404, "整改任务不存在");
    }
}
