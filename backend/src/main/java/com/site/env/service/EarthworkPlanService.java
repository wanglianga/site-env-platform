package com.site.env.service;

import com.site.env.entity.EarthworkPlan;
import com.site.env.repository.EarthworkPlanRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class EarthworkPlanService {

    @Autowired
    private EarthworkPlanRepository earthworkPlanRepository;

    public EarthworkPlan create(EarthworkPlan plan) {
        log.info("创建土方作业计划: siteId={}, planName={}", plan.getSiteId(), plan.getPlanName());
        checkNightWork(plan);
        return earthworkPlanRepository.save(plan);
    }

    private void checkNightWork(EarthworkPlan plan) {
        if (plan.getStartTime() != null && plan.getEndTime() != null) {
            try {
                int startHour = Integer.parseInt(plan.getStartTime().split(":")[0]);
                int endHour = Integer.parseInt(plan.getEndTime().split(":")[0]);
                boolean isNight = startHour >= 22 || endHour > 22 || startHour < 6 || endHour <= 6;
                plan.setIsNightWork(isNight);
                if (isNight) {
                    log.warn("夜间作业计划: siteId={}, planName={}", plan.getSiteId(), plan.getPlanName());
                }
            } catch (Exception e) {
                log.warn("解析作业时间失败: start={}, end={}", plan.getStartTime(), plan.getEndTime());
            }
        }
    }

    public Optional<EarthworkPlan> getById(Long id) {
        return earthworkPlanRepository.findById(id);
    }

    public List<EarthworkPlan> getAll() {
        return earthworkPlanRepository.findAll();
    }

    public List<EarthworkPlan> getBySiteId(Long siteId) {
        return earthworkPlanRepository.findBySiteIdOrderByPlanDateDesc(siteId);
    }

    public List<EarthworkPlan> getByPlanDate(LocalDate planDate) {
        return earthworkPlanRepository.findByPlanDate(planDate);
    }

    public List<EarthworkPlan> getNightWorkPlans() {
        return earthworkPlanRepository.findByIsNightWorkTrue();
    }

    public EarthworkPlan update(Long id, EarthworkPlan plan) {
        log.info("更新土方作业计划: id={}", id);
        return earthworkPlanRepository.findById(id)
                .map(existing -> {
                    existing.setSiteId(plan.getSiteId());
                    existing.setPlanName(plan.getPlanName());
                    existing.setPlanDate(plan.getPlanDate());
                    existing.setStartTime(plan.getStartTime());
                    existing.setEndTime(plan.getEndTime());
                    existing.setWorkContent(plan.getWorkContent());
                    existing.setOperator(plan.getOperator());
                    checkNightWork(existing);
                    return earthworkPlanRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("土方作业计划不存在: " + id));
    }

    public void delete(Long id) {
        log.info("删除土方作业计划: id={}", id);
        earthworkPlanRepository.deleteById(id);
    }
}
