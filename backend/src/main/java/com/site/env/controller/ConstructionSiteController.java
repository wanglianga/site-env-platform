package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.ConstructionSite;
import com.site.env.service.ConstructionSiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
@CrossOrigin(origins = "*")
public class ConstructionSiteController {

    @Autowired
    private ConstructionSiteService service;

    @GetMapping
    public Result<List<ConstructionSite>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<ConstructionSite> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "工地不存在"));
    }

    @GetMapping("/search")
    public Result<List<ConstructionSite>> search(@RequestParam(required = false) String constructionUnit) {
        if (constructionUnit != null && !constructionUnit.isEmpty()) {
            return Result.success(service.getByConstructionUnit(constructionUnit));
        }
        return Result.success(service.getAll());
    }

    @PostMapping
    public Result<ConstructionSite> create(@RequestBody ConstructionSite site) {
        return Result.success(service.create(site));
    }

    @PutMapping("/{id}")
    public Result<ConstructionSite> update(@PathVariable Long id, @RequestBody ConstructionSite site) {
        try {
            return Result.success(service.update(id, site));
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
        return Result.error(404, "工地不存在");
    }
}
