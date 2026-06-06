package com.site.env.service;

import com.site.env.entity.ReviewEvidence;
import com.site.env.repository.ReviewEvidenceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewEvidenceService {

    private static final Logger log = LoggerFactory.getLogger(ReviewEvidenceService.class);

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
