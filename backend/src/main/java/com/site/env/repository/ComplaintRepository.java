package com.site.env.repository;

import com.site.env.entity.Complaint;
import com.site.env.entity.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findBySiteIdOrderByCreatedAtDesc(Long siteId);
    List<Complaint> findByStatus(ComplaintStatus status);
    List<Complaint> findByHandler(String handler);
}
