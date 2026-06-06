package com.site.env.service;

import com.site.env.entity.Penalty;
import com.site.env.entity.PenaltyStatus;
import com.site.env.repository.PenaltyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class PenaltyService {

    @Autowired
    private PenaltyRepository penaltyRepository;

    public Penalty issue(Penalty penalty) {
        log.info("下发处罚: siteId={}, title={}", penalty.getSiteId(), penalty.getTitle());
        if (penalty.getStatus() == null) {
            penalty.setStatus(PenaltyStatus.ISSUED);
        }
        if (penalty.getIssuedAt() == null) {
            penalty.setIssuedAt(LocalDateTime.now());
        }
        return penaltyRepository.save(penalty);
    }

    public Penalty pay(Long id) {
        log.info("缴纳处罚: id={}", id);
        return penaltyRepository.findById(id)
                .map(penalty -> {
                    penalty.setStatus(PenaltyStatus.PAID);
                    penalty.setPaidAt(LocalDateTime.now());
                    return penaltyRepository.save(penalty);
                })
                .orElseThrow(() -> new RuntimeException("处罚不存在: " + id));
    }

    public Penalty archive(Long id) {
        log.info("归档处罚: id={}", id);
        return penaltyRepository.findById(id)
                .map(penalty -> {
                    penalty.setStatus(PenaltyStatus.ARCHIVED);
                    penalty.setArchivedAt(LocalDateTime.now());
                    return penaltyRepository.save(penalty);
                })
                .orElseThrow(() -> new RuntimeException("处罚不存在: " + id));
    }

    public Optional<Penalty> getById(Long id) {
        return penaltyRepository.findById(id);
    }

    public List<Penalty> getAll() {
        return penaltyRepository.findAll();
    }

    public List<Penalty> getBySiteId(Long siteId) {
        return penaltyRepository.findBySiteIdOrderByIssuedAtDesc(siteId);
    }

    public List<Penalty> getByStatus(PenaltyStatus status) {
        return penaltyRepository.findByStatus(status);
    }

    public List<Penalty> getByTaskId(Long taskId) {
        return penaltyRepository.findByTaskId(taskId);
    }

    public Penalty update(Long id, Penalty penalty) {
        log.info("更新处罚: id={}", id);
        return penaltyRepository.findById(id)
                .map(existing -> {
                    existing.setTaskId(penalty.getTaskId());
                    existing.setType(penalty.getType());
                    existing.setTitle(penalty.getTitle());
                    existing.setDescription(penalty.getDescription());
                    existing.setAmount(penalty.getAmount());
                    existing.setPenaltyNo(penalty.getPenaltyNo());
                    existing.setStatus(penalty.getStatus());
                    existing.setPenalizedParty(penalty.getPenalizedParty());
                    existing.setIssuer(penalty.getIssuer());
                    return penaltyRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("处罚不存在: " + id));
    }

    public void delete(Long id) {
        log.info("删除处罚: id={}", id);
        penaltyRepository.deleteById(id);
    }
}
