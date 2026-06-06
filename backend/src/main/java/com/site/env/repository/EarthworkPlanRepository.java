package com.site.env.repository;

import com.site.env.entity.EarthworkPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EarthworkPlanRepository extends JpaRepository<EarthworkPlan, Long> {
    List<EarthworkPlan> findBySiteIdOrderByPlanDateDesc(Long siteId);
    List<EarthworkPlan> findByPlanDate(LocalDate planDate);
    List<EarthworkPlan> findByIsNightWorkTrue();
}
