package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.Complaint;
import com.site.env.entity.ComplaintStatus;
import com.site.env.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService service;

    @GetMapping
    public Result<List<Complaint>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<Complaint> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "投诉记录不存在"));
    }

    @GetMapping("/site/{siteId}")
    public Result<List<Complaint>> getBySiteId(@PathVariable Long siteId) {
        return Result.success(service.getBySiteId(siteId));
    }

    @GetMapping("/status/{status}")
    public Result<List<Complaint>> getByStatus(@PathVariable ComplaintStatus status) {
        return Result.success(service.getByStatus(status));
    }

    @GetMapping("/handler/{handler}")
    public Result<List<Complaint>> getByHandler(@PathVariable String handler) {
        return Result.success(service.getByHandler(handler));
    }

    @PostMapping
    public Result<Complaint> create(@RequestBody Complaint complaint) {
        return Result.success(service.create(complaint));
    }

    @PutMapping("/{id}")
    public Result<Complaint> update(@PathVariable Long id, @RequestBody Complaint complaint) {
        try {
            return Result.success(service.update(id, complaint));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    @PutMapping("/{id}/dispatch")
    public Result<Complaint> dispatch(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String handler = body.get("handler");
            return Result.success(service.dispatch(id, handler));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    @PutMapping("/{id}/process")
    public Result<Complaint> process(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String processResult = body.get("processResult");
            return Result.success(service.process(id, processResult));
        } catch (RuntimeException e) {
            return Result.error(404, e.getMessage());
        }
    }

    @PutMapping("/{id}/close")
    public Result<Complaint> close(@PathVariable Long id) {
        try {
            return Result.success(service.close(id));
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
        return Result.error(404, "投诉记录不存在");
    }
}
