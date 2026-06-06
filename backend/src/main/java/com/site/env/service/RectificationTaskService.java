package com.site.env.service;

import com.site.env.entity.RectificationStatus;
import com.site.env.entity.RectificationTask;
import com.site.env.repository.RectificationTaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RectificationTaskService {

    private static final Logger log = LoggerFactory.getLogger(RectificationTaskService.class);

    @Autowired
    private RectificationTaskRepository rectificationTaskRepository;

    public RectificationTask create(RectificationTask task) {
        log.info("发起整改任务: siteId={}, title={}", task.getSiteId(), task.getTitle());
        if (task.getStatus() == null) {
            task.setStatus(RectificationStatus.PENDING);
        }
        return rectificationTaskRepository.save(task);
    }

    public RectificationTask submit(Long id, String remark) {
        log.info("提交整改任务: id={}", id);
        return rectificationTaskRepository.findById(id)
                .map(task -> {
                    task.setStatus(RectificationStatus.SUBMITTED);
                    task.setSubmittedAt(LocalDateTime.now());
                    return rectificationTaskRepository.save(task);
                })
                .orElseThrow(() -> new RuntimeException("整改任务不存在: " + id));
    }

    public RectificationTask review(Long id, boolean passed) {
        log.info("复查整改任务: id={}, passed={}", id, passed);
        return rectificationTaskRepository.findById(id)
                .map(task -> {
                    if (passed) {
                        task.setStatus(RectificationStatus.REVIEWED);
                    } else {
                        task.setStatus(RectificationStatus.PROCESSING);
                    }
                    task.setReviewedAt(LocalDateTime.now());
                    return rectificationTaskRepository.save(task);
                })
                .orElseThrow(() -> new RuntimeException("整改任务不存在: " + id));
    }

    public List<RectificationTask> detectOverdue() {
        log.info("检测逾期整改任务");
        List<RectificationTask> overdueTasks = rectificationTaskRepository
                .findOverdueTasks(RectificationStatus.PENDING, LocalDateTime.now());
        overdueTasks.addAll(rectificationTaskRepository
                .findOverdueTasks(RectificationStatus.PROCESSING, LocalDateTime.now()));
        overdueTasks.forEach(task -> {
            task.setStatus(RectificationStatus.OVERDUE);
            rectificationTaskRepository.save(task);
            log.warn("整改任务逾期: id={}, title={}", task.getId(), task.getTitle());
        });
        return overdueTasks;
    }

    public Optional<RectificationTask> getById(Long id) {
        return rectificationTaskRepository.findById(id);
    }

    public List<RectificationTask> getAll() {
        return rectificationTaskRepository.findAll();
    }

    public List<RectificationTask> getBySiteId(Long siteId) {
        return rectificationTaskRepository.findBySiteIdOrderByCreatedAtDesc(siteId);
    }

    public List<RectificationTask> getByStatus(RectificationStatus status) {
        return rectificationTaskRepository.findByStatus(status);
    }

    public List<RectificationTask> getByRectificationPerson(String rectificationPerson) {
        return rectificationTaskRepository.findByRectificationPerson(rectificationPerson);
    }

    public RectificationTask update(Long id, RectificationTask task) {
        log.info("更新整改任务: id={}", id);
        return rectificationTaskRepository.findById(id)
                .map(existing -> {
                    existing.setType(task.getType());
                    existing.setTitle(task.getTitle());
                    existing.setDescription(task.getDescription());
                    existing.setSource(task.getSource());
                    existing.setInitiator(task.getInitiator());
                    existing.setRectificationPerson(task.getRectificationPerson());
                    existing.setPersonPhone(task.getPersonPhone());
                    existing.setStatus(task.getStatus());
                    existing.setDeadline(task.getDeadline());
                    return rectificationTaskRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("整改任务不存在: " + id));
    }

    public void delete(Long id) {
        log.info("删除整改任务: id={}", id);
        rectificationTaskRepository.deleteById(id);
    }
}
