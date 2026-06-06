package com.site.env.controller;

import com.site.env.common.Result;
import com.site.env.entity.Vehicle;
import com.site.env.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    @Autowired
    private VehicleService service;

    @GetMapping
    public Result<List<Vehicle>> list() {
        return Result.success(service.getAll());
    }

    @GetMapping("/{id}")
    public Result<Vehicle> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(Result::success)
                .orElse(Result.error(404, "车辆不存在"));
    }

    @GetMapping("/plate/{plateNumber}")
    public Result<Vehicle> getByPlateNumber(@PathVariable String plateNumber) {
        return service.getByPlateNumber(plateNumber)
                .map(Result::success)
                .orElse(Result.error(404, "车辆不存在"));
    }

    @GetMapping("/site/{siteId}")
    public Result<List<Vehicle>> getBySiteId(@PathVariable Long siteId) {
        return Result.success(service.getBySiteId(siteId));
    }

    @GetMapping("/team/{transportTeam}")
    public Result<List<Vehicle>> getByTransportTeam(@PathVariable String transportTeam) {
        return Result.success(service.getByTransportTeam(transportTeam));
    }

    @PostMapping
    public Result<Vehicle> create(@RequestBody Vehicle vehicle) {
        return Result.success(service.create(vehicle));
    }

    @PutMapping("/{id}")
    public Result<Vehicle> update(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        try {
            return Result.success(service.update(id, vehicle));
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
        return Result.error(404, "车辆不存在");
    }
}
