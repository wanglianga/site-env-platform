package com.site.env.repository;

import com.site.env.entity.ReviewEvidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewEvidenceRepository extends JpaRepository<ReviewEvidence, Long> {
    List<ReviewEvidence> findByTaskIdOrderBySubmittedAtDesc(Long taskId);
    List<ReviewEvidence> findBySiteIdOrderBySubmittedAtDesc(Long siteId);
}
