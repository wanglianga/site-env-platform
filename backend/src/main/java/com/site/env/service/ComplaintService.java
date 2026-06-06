package com.site.env.service;

import com.site.env.entity.Complaint;
import com.site.env.entity.ComplaintStatus;
import com.site.env.repository.ComplaintRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public Complaint create(Complaint complaint) {
        log.info("创建投诉工单: complainant={}", complaint.getComplainant());
        if (complaint.getStatus() == null) {
            complaint.setStatus(ComplaintStatus.PENDING);
        }
        return complaintRepository.save(complaint);
    }

    public Complaint dispatch(Long id, String handler) {
        log.info("派单投诉工单: id={}, handler={}", id, handler);
        return complaintRepository.findById(id)
                .map(complaint -> {
                    complaint.setStatus(ComplaintStatus.DISPATCHED);
                    complaint.setHandler(handler);
                    complaint.setDispatchedAt(LocalDateTime.now());
                    return complaintRepository.save(complaint);
                })
                .orElseThrow(() -> new RuntimeException("投诉工单不存在: " + id));
    }

    public Complaint process(Long id, String processResult) {
        log.info("处理投诉工单: id={}", id);
        return complaintRepository.findById(id)
                .map(complaint -> {
                    complaint.setStatus(ComplaintStatus.PROCESSED);
                    complaint.setProcessResult(processResult);
                    complaint.setProcessedAt(LocalDateTime.now());
                    return complaintRepository.save(complaint);
                })
                .orElseThrow(() -> new RuntimeException("投诉工单不存在: " + id));
    }

    public Complaint close(Long id) {
        log.info("关闭投诉工单: id={}", id);
        return complaintRepository.findById(id)
                .map(complaint -> {
                    complaint.setStatus(ComplaintStatus.CLOSED);
                    complaint.setClosedAt(LocalDateTime.now());
                    return complaintRepository.save(complaint);
                })
                .orElseThrow(() -> new RuntimeException("投诉工单不存在: " + id));
    }

    public Optional<Complaint> getById(Long id) {
        return complaintRepository.findById(id);
    }

    public List<Complaint> getAll() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getBySiteId(Long siteId) {
        return complaintRepository.findBySiteIdOrderByCreatedAtDesc(siteId);
    }

    public List<Complaint> getByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status);
    }

    public List<Complaint> getByHandler(String handler) {
        return complaintRepository.findByHandler(handler);
    }

    public Complaint update(Long id, Complaint complaint) {
        log.info("更新投诉工单: id={}", id);
        return complaintRepository.findById(id)
                .map(existing -> {
                    existing.setSiteId(complaint.getSiteId());
                    existing.setComplainant(complaint.getComplainant());
                    existing.setComplainantPhone(complaint.getComplainantPhone());
                    existing.setContent(complaint.getContent());
                    existing.setScreenshotUrl(complaint.getScreenshotUrl());
                    existing.setStatus(complaint.getStatus());
                    existing.setHandler(complaint.getHandler());
                    existing.setProcessResult(complaint.getProcessResult());
                    return complaintRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("投诉工单不存在: " + id));
    }

    public void delete(Long id) {
        log.info("删除投诉工单: id={}", id);
        complaintRepository.deleteById(id);
    }
}
