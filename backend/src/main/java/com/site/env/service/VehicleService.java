package com.site.env.service;

import com.site.env.entity.Vehicle;
import com.site.env.repository.VehicleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    public Vehicle create(Vehicle vehicle) {
        log.info("创建车辆: plateNumber={}", vehicle.getPlateNumber());
        return vehicleRepository.save(vehicle);
    }

    public Optional<Vehicle> getById(Long id) {
        return vehicleRepository.findById(id);
    }

    public Optional<Vehicle> getByPlateNumber(String plateNumber) {
        return vehicleRepository.findByPlateNumber(plateNumber);
    }

    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> getBySiteId(Long siteId) {
        return vehicleRepository.findBySiteId(siteId);
    }

    public List<Vehicle> getByTransportTeam(String transportTeam) {
        return vehicleRepository.findByTransportTeam(transportTeam);
    }

    public Vehicle update(Long id, Vehicle vehicle) {
        log.info("更新车辆: id={}", id);
        return vehicleRepository.findById(id)
                .map(existing -> {
                    existing.setSiteId(vehicle.getSiteId());
                    existing.setPlateNumber(vehicle.getPlateNumber());
                    existing.setDriverName(vehicle.getDriverName());
                    existing.setTransportTeam(vehicle.getTransportTeam());
                    existing.setRoute(vehicle.getRoute());
                    existing.setLoadTime(vehicle.getLoadTime());
                    existing.setWashStatus(vehicle.getWashStatus());
                    return vehicleRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("车辆不存在: " + id));
    }

    public void delete(Long id) {
        log.info("删除车辆: id={}", id);
        vehicleRepository.deleteById(id);
    }
}
