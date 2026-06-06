package com.site.env.repository;

import com.site.env.entity.Penalty;
import com.site.env.entity.PenaltyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PenaltyRepository extends JpaRepository<Penalty, Long> {
    List<Penalty> findBySiteIdOrderByIssuedAtDesc(Long siteId);
    List<Penalty> findByStatus(PenaltyStatus status);
    List<Penalty> findByTaskId(Long taskId);
}
