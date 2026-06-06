package com.site.env.repository;

import com.site.env.entity.NightApprovalStatus;
import com.site.env.entity.NightExcavationApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface NightExcavationApprovalRepository extends JpaRepository<NightExcavationApproval, Long> {
    List<NightExcavationApproval> findBySiteIdOrderByCreatedAtDesc(Long siteId);
    List<NightExcavationApproval> findByStatus(NightApprovalStatus status);
    List<NightExcavationApproval> findBySiteIdAndWorkDate(Long siteId, LocalDate workDate);
    List<NightExcavationApproval> findBySiteIdAndStatusAndWorkDate(Long siteId, NightApprovalStatus status, LocalDate workDate);
}
