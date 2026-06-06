package com.site.env.config;

import com.site.env.entity.*;
import com.site.env.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ConstructionSiteRepository siteRepository;
    @Autowired
    private MonitoringDeviceRepository deviceRepository;
    @Autowired
    private DustReadingRepository dustReadingRepository;
    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private VehicleRecordRepository vehicleRecordRepository;
    @Autowired
    private WashRecordRepository washRecordRepository;
    @Autowired
    private RectificationTaskRepository taskRepository;
    @Autowired
    private ReviewEvidenceRepository evidenceRepository;
    @Autowired
    private PenaltyRepository penaltyRepository;
    @Autowired
    private ComplaintRepository complaintRepository;
    @Autowired
    private EarthworkPlanRepository planRepository;

    private final Random random = new Random();

    @Override
    public void run(String... args) {
        if (siteRepository.count() > 0) {
            return;
        }

        ConstructionSite site1 = createSite("城东新城A地块项目", "城东区建设大道188号", "城东建设集团", "张经理", "13800138001", "完好", "正常", "李工", "13900139001");
        ConstructionSite site2 = createSite("滨江花园二期工程", "滨江区江南大道66号", "滨江建工", "王主任", "13800138002", "完好", "正常", "赵工", "13900139002");
        ConstructionSite site3 = createSite("科技园三期厂房", "高新区科技路99号", "科技建筑公司", "陈总", "13800138003", "部分破损", "部分故障", "孙工", "13900139003");

        createDevice(site1.getId(), "DUST-001", "扬尘监测仪1号", DeviceStatus.ONLINE, 75.0, 150.0, 300.0);
        createDevice(site1.getId(), "DUST-002", "扬尘监测仪2号", DeviceStatus.ONLINE, 75.0, 150.0, 300.0);
        createDevice(site2.getId(), "DUST-003", "扬尘监测仪3号", DeviceStatus.ONLINE, 75.0, 150.0, 300.0);
        createDevice(site3.getId(), "DUST-004", "扬尘监测仪4号", DeviceStatus.OFFLINE, 75.0, 150.0, 300.0);

        LocalDateTime now = LocalDateTime.now();
        for (int i = 23; i >= 0; i--) {
            LocalDateTime time = now.minusHours(i);
            createDustReading(site1.getId(), 1L, 35 + random.nextInt(60), 70 + random.nextInt(120), 150 + random.nextInt(250), 25.0, 60.0, 2.5, time);
            createDustReading(site2.getId(), 3L, 30 + random.nextInt(40), 60 + random.nextInt(80), 120 + random.nextInt(150), 26.0, 55.0, 3.0, time);
        }
        createDustReading(site1.getId(), 1L, 95, 180, 380, 28.0, 45.0, 1.5, now.minusMinutes(30));

        Vehicle v1 = createVehicle(site1.getId(), "京A12345", "刘司机", "顺达运输队", "东门-建设大道-绕城高速", LocalDateTime.now().minusHours(2), WashStatus.WASHED);
        Vehicle v2 = createVehicle(site1.getId(), "京B67890", "周司机", "顺达运输队", "东门-建设大道-绕城高速", LocalDateTime.now().minusHours(1), WashStatus.UNWASHED);
        Vehicle v3 = createVehicle(site2.getId(), "京C54321", "吴司机", "快捷物流", "南门-江南大道-三环", LocalDateTime.now().minusHours(3), WashStatus.WASHED);

        createVehicleRecord(site1.getId(), "京A12345", RecordType.IN, now.minusHours(4), WashStatus.WASHED, false);
        createVehicleRecord(site1.getId(), "京A12345", RecordType.OUT, now.minusHours(2), WashStatus.WASHED, false);
        createVehicleRecord(site1.getId(), "京B67890", RecordType.IN, now.minusHours(3), WashStatus.UNWASHED, false);
        createVehicleRecord(site1.getId(), "京B67890", RecordType.OUT, now.minusHours(1), WashStatus.UNWASHED, false);
        createVehicleRecord(site1.getId(), "京D99999", RecordType.OUT, now.minusHours(26), WashStatus.UNWASHED, true);

        createWashRecord(site1.getId(), "京A12345", now.minusHours(2).minusMinutes(5), now.minusHours(2), 5, WashStatus.WASHED, "操作员A");
        createWashRecord(site2.getId(), "京C54321", now.minusHours(3).minusMinutes(4), now.minusHours(3), 4, WashStatus.WASHED, "操作员B");

        RectificationTask task1 = createTask(site1.getId(), RectificationType.DUST, "扬尘浓度超标", "PM10浓度达到180μg/m³，超过限值150μg/m³", "监测系统", "监管员", "李工", "13900139001", RectificationStatus.PENDING, now.plusDays(3));
        RectificationTask task2 = createTask(site1.getId(), RectificationType.VEHICLE, "车辆未冲洗出场", "渣土车京B67890未冲洗直接驶出工地", "抓拍系统", "监管员", "李工", "13900139001", RectificationStatus.PROCESSING, now.plusDays(2));
        RectificationTask task3 = createTask(site3.getId(), RectificationType.DUST, "监测设备离线", "DUST-004设备离线超过24小时", "设备告警", "监管员", "孙工", "13900139003", RectificationStatus.OVERDUE, now.minusDays(1));

        createEvidence(task2.getId(), site1.getId(), "整改说明", "已对车辆冲洗设备进行检修，加强出场检查", "张主管", now.minusHours(30));
        createEvidence(task2.getId(), site1.getId(), "现场照片", "冲洗设备修复后照片", "张主管", now.minusHours(28));

        createPenalty(site1.getId(), task1.getId(), PenaltyType.DUST_OVERLIMIT, "扬尘超标处罚", "PM10浓度持续超标，违反大气污染防治规定", new BigDecimal("5000.00"), "P2024001", PenaltyStatus.ISSUED, "城东建设集团", "监管员", now.minusDays(1));
        createPenalty(site3.getId(), task3.getId(), PenaltyType.RECTIFICATION_OVERDUE, "整改逾期处罚", "监测设备离线整改任务已逾期", new BigDecimal("10000.00"), "P2024002", PenaltyStatus.ISSUED, "科技建筑公司", "监管员", now.minusDays(2));

        createComplaint(site1.getId(), "附近居民", "12345678901", "夜间施工噪声扰民，凌晨还在出土作业", ComplaintStatus.DISPATCHED, "巡查员A", now.minusHours(5), null, null, null);
        createComplaint(site2.getId(), "路人", "", "工地门口道路扬尘严重，车辆经过时漫天灰尘", ComplaintStatus.PENDING, null, null, null, null, null);

        createPlan(site1.getId(), "6月6日白天出土", LocalDate.now(), "08:00", "18:00", "土方外运作业", "刘工", false);
        createPlan(site3.getId(), "6月5日夜间土方", LocalDate.now().minusDays(1), "22:00", "06:00", "夜间土方作业（已报备）", "陈工", true);
    }

    private ConstructionSite createSite(String name, String address, String unit, String person, String phone,
                                        String enclosure, String sprinkler, String rectManager, String managerPhone) {
        ConstructionSite site = new ConstructionSite();
        site.setName(name);
        site.setAddress(address);
        site.setConstructionUnit(unit);
        site.setResponsiblePerson(person);
        site.setContactPhone(phone);
        site.setEnclosureStatus(enclosure);
        site.setSprinklerStatus(sprinkler);
        site.setRectificationManager(rectManager);
        site.setManagerPhone(managerPhone);
        return siteRepository.save(site);
    }

    private MonitoringDevice createDevice(Long siteId, String code, String name, DeviceStatus status,
                                          Double pm25, Double pm10, Double tsp) {
        MonitoringDevice device = new MonitoringDevice();
        device.setSiteId(siteId);
        device.setDeviceCode(code);
        device.setDeviceName(name);
        device.setStatus(status);
        device.setPm25Threshold(pm25);
        device.setPm10Threshold(pm10);
        device.setTspThreshold(tsp);
        device.setLastHeartbeat(LocalDateTime.now().minusMinutes(status == DeviceStatus.ONLINE ? 5 : 60));
        return deviceRepository.save(device);
    }

    private void createDustReading(Long siteId, Long deviceId, double pm25, double pm10, double tsp,
                                   double temp, double humidity, double wind, LocalDateTime time) {
        DustReading reading = new DustReading();
        reading.setSiteId(siteId);
        reading.setDeviceId(deviceId);
        reading.setPm25(pm25);
        reading.setPm10(pm10);
        reading.setTsp(tsp);
        reading.setTemperature(temp);
        reading.setHumidity(humidity);
        reading.setWindSpeed(wind);
        reading.setIsOverlimit(pm25 > 75 || pm10 > 150 || tsp > 300);
        if (reading.getIsOverlimit()) {
            StringBuilder sb = new StringBuilder();
            if (pm25 > 75) sb.append("PM2.5 ");
            if (pm10 > 150) sb.append("PM10 ");
            if (tsp > 300) sb.append("TSP");
            reading.setOverlimitType(sb.toString().trim());
        }
        reading.setReadingTime(time);
        dustReadingRepository.save(reading);
    }

    private Vehicle createVehicle(Long siteId, String plate, String driver, String team,
                                  String route, LocalDateTime loadTime, WashStatus status) {
        Vehicle v = new Vehicle();
        v.setSiteId(siteId);
        v.setPlateNumber(plate);
        v.setDriverName(driver);
        v.setTransportTeam(team);
        v.setRoute(route);
        v.setLoadTime(loadTime);
        v.setWashStatus(status);
        return vehicleRepository.save(v);
    }

    private void createVehicleRecord(Long siteId, String plate, RecordType type, LocalDateTime time,
                                     WashStatus wash, boolean nightViolation) {
        VehicleRecord record = new VehicleRecord();
        record.setSiteId(siteId);
        record.setPlateNumber(plate);
        record.setRecordType(type);
        record.setRecordTime(time);
        record.setWashStatus(wash);
        record.setIsNightViolation(nightViolation);
        int hour = time.getHour();
        if (hour >= 22 || hour < 6) {
            record.setIsNightViolation(true);
        }
        vehicleRecordRepository.save(record);
    }

    private void createWashRecord(Long siteId, String plate, LocalDateTime start, LocalDateTime end,
                                  int duration, WashStatus status, String operator) {
        WashRecord record = new WashRecord();
        record.setSiteId(siteId);
        record.setPlateNumber(plate);
        record.setWashStart(start);
        record.setWashEnd(end);
        record.setWashDuration(duration);
        record.setStatus(status);
        record.setOperator(operator);
        washRecordRepository.save(record);
    }

    private RectificationTask createTask(Long siteId, RectificationType type, String title, String desc,
                                         String source, String initiator, String person, String phone,
                                         RectificationStatus status, LocalDateTime deadline) {
        RectificationTask task = new RectificationTask();
        task.setSiteId(siteId);
        task.setType(type);
        task.setTitle(title);
        task.setDescription(desc);
        task.setSource(source);
        task.setInitiator(initiator);
        task.setRectificationPerson(person);
        task.setPersonPhone(phone);
        task.setStatus(status);
        task.setDeadline(deadline);
        if (status == RectificationStatus.SUBMITTED || status == RectificationStatus.REVIEWED) {
            task.setSubmittedAt(deadline.minusHours(1));
        }
        if (status == RectificationStatus.REVIEWED) {
            task.setReviewedAt(deadline);
        }
        return taskRepository.save(task);
    }

    private void createEvidence(Long taskId, Long siteId, String type, String desc, String submitter, LocalDateTime time) {
        ReviewEvidence evidence = new ReviewEvidence();
        evidence.setTaskId(taskId);
        evidence.setSiteId(siteId);
        evidence.setEvidenceType(type);
        evidence.setDescription(desc);
        evidence.setSubmitter(submitter);
        evidence.setSubmittedAt(time);
        evidenceRepository.save(evidence);
    }

    private void createPenalty(Long siteId, Long taskId, PenaltyType type, String title, String desc,
                               BigDecimal amount, String no, PenaltyStatus status, String party,
                               String issuer, LocalDateTime issuedAt) {
        Penalty p = new Penalty();
        p.setSiteId(siteId);
        p.setTaskId(taskId);
        p.setType(type);
        p.setTitle(title);
        p.setDescription(desc);
        p.setAmount(amount);
        p.setPenaltyNo(no);
        p.setStatus(status);
        p.setPenalizedParty(party);
        p.setIssuer(issuer);
        p.setIssuedAt(issuedAt);
        if (status == PenaltyStatus.PAID) {
            p.setPaidAt(issuedAt.plusDays(3));
        }
        if (status == PenaltyStatus.ARCHIVED) {
            p.setPaidAt(issuedAt.plusDays(3));
            p.setArchivedAt(issuedAt.plusDays(5));
        }
        penaltyRepository.save(p);
    }

    private void createComplaint(Long siteId, String complainant, String phone, String content,
                                 ComplaintStatus status, String handler, LocalDateTime dispatched,
                                 LocalDateTime processed, LocalDateTime closed, String result) {
        Complaint c = new Complaint();
        c.setSiteId(siteId);
        c.setComplainant(complainant);
        c.setComplainantPhone(phone);
        c.setContent(content);
        c.setStatus(status);
        c.setHandler(handler);
        c.setDispatchedAt(dispatched);
        c.setProcessedAt(processed);
        c.setClosedAt(closed);
        c.setProcessResult(result);
        complaintRepository.save(c);
    }

    private void createPlan(Long siteId, String name, LocalDate date, String start, String end,
                            String content, String operator, boolean night) {
        EarthworkPlan plan = new EarthworkPlan();
        plan.setSiteId(siteId);
        plan.setPlanName(name);
        plan.setPlanDate(date);
        plan.setStartTime(start);
        plan.setEndTime(end);
        plan.setWorkContent(content);
        plan.setOperator(operator);
        plan.setIsNightWork(night);
        planRepository.save(plan);
    }
}
