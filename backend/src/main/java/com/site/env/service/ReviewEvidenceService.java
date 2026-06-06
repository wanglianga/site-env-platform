package com.site.env.service;

import com.site.env.entity.ReviewEvidence;
import com.site.env.repository.ReviewEvidenceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ReviewEvidenceService {

    @Autowired
    private ReviewEvidenceRepository reviewEvidenceRepository;

    public ReviewEvidence upload(ReviewEvidence evidence) {
        log.info("上传复查证据: taskId={}", evidence.getTaskId());
        return reviewEvidenceRepository.save(evidence);
    }

    public Optional<ReviewEvidence> getById(Long id) {
        return reviewEvidenceRepository.findById(id);
    }

    public List<ReviewEvidence> getAll() {
        return reviewEvidenceRepository.findAll();
    }

    public List<ReviewEvidence> getByTaskId(Long taskId) {
        return reviewEvidenceRepository.findByTaskIdOrderBySubmittedAtDesc(taskId);
    }

    public List<ReviewEvidence> getBySiteId(Long siteId) {
        return reviewEvidenceRepository.findBySiteIdOrderBySubmittedAtDesc(siteId);
    }

    public void delete(Long id) {
        log.info("删除复查证据: id={}", id);
        reviewEvidenceRepository.deleteById(id);
    }
}
