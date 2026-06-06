# 工地环保监管平台

一个面向施工单位、环保巡查员、渣土运输队和街道监管人员的多角色协同工地环保监管平台。

## 原始需求

> 建设一个给施工单位、环保巡查员、渣土运输队和街道监管人员使用的工地环保平台，React 页面展示工地监测、车辆出入、整改任务和复查证据，Spring Boot 保存扬尘读数、车辆抓拍、冲洗记录和处罚处理。施工单位维护工地围挡、喷淋设备、土方作业计划和整改负责人；运输队填写渣土车车牌、路线、装载时间和冲洗状态；环保巡查员查看 PM 读数、视频截图、出入口抓拍和投诉；街道监管人员发起整改、复查和处罚。系统要把扬尘超标、车辆出场、冲洗确认、投诉派单、整改复查和处罚归档连起来。设备离线、车辆未冲洗、夜间违规出土、整改逾期要对应不同业务后果。

## 技术栈

- **后端**：Spring Boot 2.7 + JPA + H2（开发）/ MySQL（生产）+ Lombok
- **前端**：React 18 + Vite + Ant Design 5 + React Router 6 + Axios + ECharts
- **部署**：Docker + Docker Compose

## 项目结构

```
wmy-25/
├── backend/                    # Spring Boot 后端
│   ├── src/main/java/com/site/env/
│   │   ├── entity/            # 实体类（12个）
│   │   ├── repository/        # 数据访问层（11个）
│   │   ├── service/           # 业务服务层（12个）
│   │   ├── controller/        # 控制器层（12个）
│   │   ├── common/            # 公共类（Result、CORS配置）
│   │   └── config/            # 配置类（WebConfig、数据初始化）
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── pages/             # 页面组件（9个）
│   │   ├── layouts/           # 布局组件
│   │   ├── api/               # API 接口封装
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml          # Docker 编排
├── .env.example
└── README.md
```

## 启动方式

### 前置要求

- Docker 20.10+ 和 Docker Compose 2.0+（推荐方式）
- 或 JDK 8 + Maven 3.6+ + Node.js 18+ + MySQL 8.0（本地开发）

### Docker 一键启动（推荐）

#### 1. 配置环境变量

```bash
cp .env.example .env
```

（可选，默认值已可直接运行）

#### 2. 构建并启动

```bash
docker compose up --build
```

后台运行：
```bash
docker compose up --build -d
```

#### 3. 访问地址

- 前端页面：http://localhost:3000
- 后端 API：http://localhost:8080
- H2 控制台（仅开发环境）：http://localhost:8080/h2-console

#### 4. 停止和清理

```bash
docker compose down
```

### 本地开发启动

#### 后端

```bash
cd backend

# 编译
mvn clean package -DskipTests

# 运行（使用H2内存数据库）
mvn spring-boot:run
```

后端启动后访问：http://localhost:8080

#### 前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端启动后访问：http://localhost:3000

## 功能模块

### 1. 工地监测仪表盘
- PM2.5 / PM10 / TSP 实时数据展示
- 24小时扬尘浓度趋势图（ECharts）
- 超标告警列表
- 工地、设备、车辆等综合统计

### 2. 车辆出入管理
- 渣土车进出记录
- 车牌识别抓拍展示
- 夜间违规出土检测（22:00-06:00）
- 冲洗状态确认

### 3. 渣土车管理
- 车辆信息维护（车牌、司机、运输队）
- 运输路线管理
- 装载时间和冲洗状态

### 4. 冲洗记录
- 车辆冲洗记录台账
- 冲洗时长确认（≥3分钟判定合格）
- 未冲洗出场预警

### 5. 整改任务中心
- 整改任务发起和派单
- 整改过程跟踪
- 状态流转：待处理 → 处理中 → 已提交 → 已复查/已逾期
- 整改逾期自动标记

### 6. 复查证据库
- 整改复查证据上传
- 图片和文字说明
- 按任务和工地筛选

### 7. 处罚管理
- 违章处罚下发
- 处罚类型：扬尘超标、车辆未冲洗、夜间违规、整改逾期
- 处罚缴纳和归档
- 状态流转：已下发 → 已缴纳 → 已归档

### 8. 投诉处理
- 居民投诉受理
- 投诉派单给巡查员
- 处理结果反馈
- 投诉闭环管理

### 9. 工地信息管理
- 施工单位维护工地围挡状态
- 喷淋设备状态管理
- 整改负责人信息

### 10. 土方作业计划
- 土方作业计划申报
- 夜间作业报备
- 作业时间和内容管理

## API 接口

所有接口统一前缀 `/api`，返回格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

主要接口：
- `GET /api/dashboard/stats` - 仪表盘统计
- `GET /api/sites` - 工地列表
- `GET /api/dust-readings` - 扬尘读数列表
- `GET /api/vehicle-records` - 车辆出入记录
- `GET /api/wash-records` - 冲洗记录
- `GET /api/night-excavation-approvals` - 夜间出土审批列表
- `POST /api/night-excavation-approvals` - 提交夜间出土申请
- `PUT /api/night-excavation-approvals/{id}/approve` - 审批通过
- `PUT /api/night-excavation-approvals/{id}/reject` - 审批拒绝
- `GET /api/rectification-tasks` - 整改任务
- `GET /api/review-evidences` - 复查证据
- `GET /api/penalties` - 处罚记录
- `GET /api/complaints` - 投诉工单
- `GET /api/earthwork-plans` - 土方计划
- `GET /api/devices` - 监测设备
