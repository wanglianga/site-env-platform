package com.site.env.repository;

import com.site.env.entity.RectificationStatus;
import com.site.env.entity.RectificationTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RectificationTaskRepository extends JpaRepository<RectificationTask, Long> {
    List<RectificationTask> findBySiteIdOrderByCreatedAtDesc(Long siteId);
    List<RectificationTask> findByStatus(RectificationStatus status);
    List<RectificationTask> findByRectificationPerson(String rectificationPerson);

    @Query("SELECT r FROM RectificationTask r WHERE r.status = :status AND r.deadline < :now")
    List<RectificationTask> findOverdueTasks(@Param("status") RectificationStatus status,
                                             @Param("now") LocalDateTime now);
}
