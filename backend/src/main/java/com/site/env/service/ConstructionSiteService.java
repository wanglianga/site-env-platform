package com.site.env.service;

import com.site.env.entity.ConstructionSite;
import com.site.env.repository.ConstructionSiteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConstructionSiteService {

    private static final Logger log = LoggerFactory.getLogger(ConstructionSiteService.class);

    @Autowired
    private ConstructionSiteRepository constructionSiteRepository;

    public ConstructionSite create(ConstructionSite site) {
        log.info("创建工地: {}", site.getName());
        return constructionSiteRepository.save(site);
    }

    public Optional<ConstructionSite> getById(Long id) {
        return constructionSiteRepository.findById(id);
    }

    public List<ConstructionSite> getAll() {
        return constructionSiteRepository.findAll();
    }

    public List<ConstructionSite> getByConstructionUnit(String constructionUnit) {
        return constructionSiteRepository.findByConstructionUnit(constructionUnit);
    }

    public ConstructionSite update(Long id, ConstructionSite site) {
        log.info("更新工地: id={}", id);
        return constructionSiteRepository.findById(id)
                .map(existing -> {
                    existing.setName(site.getName());
                    existing.setAddress(site.getAddress());
                    existing.setConstructionUnit(site.getConstructionUnit());
                    existing.setResponsiblePerson(site.getResponsiblePerson());
                    existing.setContactPhone(site.getContactPhone());
                    existing.setEnclosureStatus(site.getEnclosureStatus());
                    existing.setSprinklerStatus(site.getSprinklerStatus());
                    existing.setRectificationManager(site.getRectificationManager());
                    existing.setManagerPhone(site.getManagerPhone());
                    return constructionSiteRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("工地不存在: " + id));
    }

    public void delete(Long id) {
        log.info("删除工地: id={}", id);
        constructionSiteRepository.deleteById(id);
    }
}
