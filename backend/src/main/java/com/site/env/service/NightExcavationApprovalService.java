package com.site.env.service;

import com.site.env.entity.NightApprovalStatus;
import com.site.env.entity.NightExcavationApproval;
import com.site.env.repository.NightExcavationApprovalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class NightExcavationApprovalService {

    private static final Logger log = LoggerFactory.getLogger(NightExcavationApprovalService.class);

    @Autowired
    private NightExcavationApprovalRepository repository;

    public NightExcavationApproval create(NightExcavationApproval approval) {
        log.info("创建夜间出土审批申请: siteId={}, workDate={}", approval.getSiteId(), approval.getWorkDate());
        approval.setApprovalNo(generateApprovalNo());
        return repository.save(approval);
    }

    private String generateApprovalNo() {
        return "NEA-" + System.currentTimeMillis();
    }

    public Optional<NightExcavationApproval> getById(Long id) {
        return repository.findById(id);
    }

    public List<NightExcavationApproval> getAll() {
        return repository.findAll();
    }

    public List<NightExcavationApproval> getBySiteId(Long siteId) {
        return repository.findBySiteIdOrderByCreatedAtDesc(siteId);
    }

    public List<NightExcavationApproval> getByStatus(NightApprovalStatus status) {
        return repository.findByStatus(status);
    }

    public List<NightExcavationApproval> getBySiteIdAndWorkDate(Long siteId, LocalDate workDate) {
        return repository.findBySiteIdAndWorkDate(siteId, workDate);
    }

    public NightExcavationApproval approve(Long id, String reviewer, String comment) {
        log.info("审批通过夜间出土申请: id={}, reviewer={}", id, reviewer);
        return repository.findById(id)
                .map(existing -> {
                    existing.setStatus(NightApprovalStatus.APPROVED);
                    existing.setReviewer(reviewer);
                    existing.setReviewComment(comment);
                    existing.setReviewedAt(LocalDateTime.now());
                    return repository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("夜间出土审批不存在: " + id));
    }

    public NightExcavationApproval reject(Long id, String reviewer, String comment) {
        log.info("审批拒绝夜间出土申请: id={}, reviewer={}", id, reviewer);
        return repository.findById(id)
                .map(existing -> {
                    existing.setStatus(NightApprovalStatus.REJECTED);
                    existing.setReviewer(reviewer);
                    existing.setReviewComment(comment);
                    existing.setReviewedAt(LocalDateTime.now());
                    return repository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("夜间出土审批不存在: " + id));
    }

    public NightExcavationApproval update(Long id, NightExcavationApproval approval) {
        log.info("更新夜间出土审批申请: id={}", id);
        return repository.findById(id)
                .map(existing -> {
                    existing.setSiteId(approval.getSiteId());
                    existing.setWorkDate(approval.getWorkDate());
                    existing.setStartTime(approval.getStartTime());
                    existing.setEndTime(approval.getEndTime());
                    existing.setRoute(approval.getRoute());
                    existing.setVehicleList(approval.getVehicleList());
                    existing.setDustControlMeasures(approval.getDustControlMeasures());
                    existing.setApplicant(approval.getApplicant());
                    existing.setApplicantContact(approval.getApplicantContact());
                    return repository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("夜间出土审批不存在: " + id));
    }

    public void delete(Long id) {
        log.info("删除夜间出土审批: id={}", id);
        repository.deleteById(id);
    }

    public boolean isVehicleAllowed(Long siteId, String plateNumber, LocalDateTime recordTime) {
        LocalDate workDate = recordTime.toLocalDate();
        LocalTime recordTimeOfDay = recordTime.toLocalTime();

        List<NightExcavationApproval> approvals = repository.findBySiteIdAndStatusAndWorkDate(
                siteId, NightApprovalStatus.APPROVED, workDate);

        if (approvals.isEmpty()) {
            approvals = repository.findBySiteIdAndStatusAndWorkDate(
                    siteId, NightApprovalStatus.APPROVED, workDate.minusDays(1));
        }

        for (NightExcavationApproval approval : approvals) {
            if (isWithinApprovalWindow(approval, recordTimeOfDay, workDate, approval.getWorkDate())
                    && isVehicleInApprovalList(approval, plateNumber)) {
                return true;
            }
        }

        return false;
    }

    private boolean isWithinApprovalWindow(NightExcavationApproval approval, LocalTime recordTimeOfDay,
                                           LocalDate recordDate, LocalDate approvalDate) {
        try {
            LocalTime start = LocalTime.parse(approval.getStartTime());
            LocalTime end = LocalTime.parse(approval.getEndTime());

            if (!start.isAfter(end)) {
                return !recordTimeOfDay.isBefore(start) && !recordTimeOfDay.isAfter(end);
            } else {
                if (recordDate.equals(approvalDate)) {
                    return !recordTimeOfDay.isBefore(start);
                } else if (recordDate.equals(approvalDate.plusDays(1))) {
                    return !recordTimeOfDay.isAfter(end);
                }
                return false;
            }
        } catch (Exception e) {
            log.warn("解析审批时间失败: start={}, end={}", approval.getStartTime(), approval.getEndTime());
            return false;
        }
    }

    private boolean isVehicleInApprovalList(NightExcavationApproval approval, String plateNumber) {
        if (approval.getVehicleList() == null || approval.getVehicleList().trim().isEmpty()) {
            return false;
        }
        List<String> plates = Arrays.asList(approval.getVehicleList().split("[,，\\s]+"));
        return plates.stream().anyMatch(p -> p.trim().equalsIgnoreCase(plateNumber.trim()));
    }
}
