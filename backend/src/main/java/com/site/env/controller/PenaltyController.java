package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.Penalty;
import com.site.env.entity.PenaltyStatus;
import com.site.env.service.PenaltyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/penalties")
@CrossOrigin(origins = "*")
public class PenaltyController {

    @Autowired
    private PenaltyService service;

    @GetMapping
    public Result<List<Penalty>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<Penalty> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "处罚记录不存在"));
    }

    @GetMapping("/site/{siteId}")
    public Result<List<Penalty>> getBySiteId(@PathVariable Long siteId) {
        return Result.success(service.getBySiteId(siteId));
    }

    @GetMapping("/status/{status}")
    public Result<List<Penalty>> getByStatus(@PathVariable PenaltyStatus status) {
        return Result.success(service.getByStatus(status));
    }

    @GetMapping("/task/{taskId}")
    public Result<List<Penalty>> getByTaskId(@PathVariable Long taskId) {
        return Result.success(service.getByTaskId(taskId));
    }

    @PostMapping
    public Result<Penalty> create(@RequestBody Penalty penalty) {
        return Result.success(service.issue(penalty));
    }

    @PutMapping("/{id}")
    public Result<Penalty> update(@PathVariable Long id, @RequestBody Penalty penalty) {
        try {
            return Result.success(service.update(id, penalty));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    @PutMapping("/{id}/pay")
    public Result<Penalty> pay(@PathVariable Long id) {
        try {
            return Result.success(service.pay(id));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    @PutMapping("/{id}/archive")
    public Result<Penalty> archive(@PathVariable Long id) {
        try {
            return Result.success(service.archive(id));
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
        return Result.error(404, "处罚记录不存在");
    }
}
