package com.site.env.service;

import com.site.env.entity.*;
import com.site.env.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class DashboardService {

    @Autowired
    private ConstructionSiteRepository constructionSiteRepository;

    @Autowired
    private DustReadingRepository dustReadingRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private VehicleRecordRepository vehicleRecordRepository;

    @Autowired
    private WashRecordRepository washRecordRepository;

    @Autowired
    private RectificationTaskRepository rectificationTaskRepository;

    @Autowired
    private PenaltyRepository penaltyRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private MonitoringDeviceRepository monitoringDeviceRepository;

    public Map<String, Object> getStatistics() {
        return getSummary();
    }

    public Map<String, Object> getSummary() {
        log.info("获取仪表盘综合统计数据");
        Map<String, Object> summary = new HashMap<>();

        summary.put("siteCount", constructionSiteRepository.count());
        summary.put("deviceCount", monitoringDeviceRepository.count());
        summary.put("onlineDeviceCount", monitoringDeviceRepository.findByStatus(DeviceStatus.ONLINE).size());
        summary.put("offlineDeviceCount", monitoringDeviceRepository.findByStatus(DeviceStatus.OFFLINE).size());

        summary.put("vehicleCount", vehicleRepository.count());
        summary.put("todayVehicleRecordCount", countTodayRecords(vehicleRecordRepository.findAll()));

        List<DustReading> overlimitReadings = dustReadingRepository.findByIsOverlimitTrue();
        summary.put("overlimitReadingCount", overlimitReadings.size());

        List<WashRecord> unwashedRecords = washRecordRepository.findByStatus(WashStatus.UNWASHED);
        summary.put("unwashedCount", unwashedRecords.size());

        List<VehicleRecord> nightViolations = vehicleRecordRepository.findByIsNightViolationTrue();
        summary.put("nightViolationCount", nightViolations.size());

        List<RectificationTask> pendingTasks = rectificationTaskRepository.findByStatus(RectificationStatus.PENDING);
        List<RectificationTask> processingTasks = rectificationTaskRepository.findByStatus(RectificationStatus.PROCESSING);
        List<RectificationTask> overdueTasks = rectificationTaskRepository.findByStatus(RectificationStatus.OVERDUE);
        summary.put("pendingTaskCount", pendingTasks.size());
        summary.put("processingTaskCount", processingTasks.size());
        summary.put("overdueTaskCount", overdueTasks.size());

        List<Penalty> issuedPenalties = penaltyRepository.findByStatus(PenaltyStatus.ISSUED);
        List<Penalty> paidPenalties = penaltyRepository.findByStatus(PenaltyStatus.PAID);
        summary.put("issuedPenaltyCount", issuedPenalties.size());
        summary.put("paidPenaltyCount", paidPenalties.size());
        summary.put("totalPenaltyAmount", paidPenalties.stream()
                .map(Penalty::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        List<Complaint> pendingComplaints = complaintRepository.findByStatus(ComplaintStatus.PENDING);
        List<Complaint> dispatchedComplaints = complaintRepository.findByStatus(ComplaintStatus.DISPATCHED);
        summary.put("pendingComplaintCount", pendingComplaints.size());
        summary.put("dispatchedComplaintCount", dispatchedComplaints.size());

        return summary;
    }

    public Map<String, Object> getSiteDashboard(Long siteId) {
        log.info("获取工地仪表盘数据: siteId={}", siteId);
        Map<String, Object> data = new HashMap<>();

        constructionSiteRepository.findById(siteId).ifPresent(site -> data.put("site", site));

        List<DustReading> siteReadings = dustReadingRepository.findBySiteIdOrderByReadingTimeDesc(siteId);
        data.put("dustReadingCount", siteReadings.size());
        if (!siteReadings.isEmpty()) {
            data.put("latestDustReading", siteReadings.get(0));
        }
        data.put("overlimitReadingCount", (int) siteReadings.stream()
                .filter(r -> Boolean.TRUE.equals(r.getIsOverlimit()))
                .count());

        data.put("deviceList", monitoringDeviceRepository.findBySiteId(siteId));
        data.put("vehicleList", vehicleRepository.findBySiteId(siteId));
        data.put("vehicleRecordList", vehicleRecordRepository.findBySiteIdOrderByRecordTimeDesc(siteId));
        data.put("washRecordList", washRecordRepository.findBySiteIdOrderByCreatedAtDesc(siteId));
        data.put("rectificationTaskList", rectificationTaskRepository.findBySiteIdOrderByCreatedAtDesc(siteId));
        data.put("penaltyList", penaltyRepository.findBySiteIdOrderByIssuedAtDesc(siteId));
        data.put("complaintList", complaintRepository.findBySiteIdOrderByCreatedAtDesc(siteId));

        return data;
    }

    private long countTodayRecords(List<?> records) {
        LocalDateTime todayStart = LocalDateTime.now().toLocalDate().atStartOfDay();
        if (records.isEmpty()) {
            return 0;
        }
        if (records.get(0) instanceof VehicleRecord) {
            return records.stream()
                    .map(r -> (VehicleRecord) r)
                    .filter(r -> r.getRecordTime() != null && r.getRecordTime().isAfter(todayStart))
                    .count();
        }
        return 0;
    }
}
