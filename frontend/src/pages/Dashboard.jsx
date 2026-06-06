import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Table, Tag, Select, DatePicker, Spin } from 'antd'
import ReactECharts from 'echarts-for-react'
import dayjs from 'dayjs'
import { api } from '../api'
import { WarningOutlined, EnvironmentOutlined, CloudOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

const mockDustStats = [
  { siteId: 1, siteName: '中央公园A区工地', pm25: 75, pm10: 120, tsp: 180, status: 'warning' },
  { siteId: 2, siteName: '滨江大道改造工程', pm25: 45, pm10: 85, tsp: 120, status: 'normal' },
  { siteId: 3, siteName: '科技园B区一期', pm25: 120, pm10: 200, tsp: 320, status: 'overlimit' },
  { siteId: 4, siteName: '地铁5号线施工现场', pm25: 55, pm10: 95, tsp: 145, status: 'warning' },
]

const mockTrendData = {
  times: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  pm25: [55, 52, 48, 50, 45, 42, 55, 65, 78, 85, 92, 88, 75, 70, 68, 72, 80, 88, 95, 90, 82, 70, 62, 58],
  pm10: [85, 82, 78, 80, 75, 72, 85, 95, 108, 115, 122, 118, 105, 100, 98, 102, 110, 118, 125, 120, 112, 100, 92, 88],
  tsp: [130, 125, 118, 122, 115, 110, 125, 140, 160, 175, 185, 180, 160, 150, 148, 155, 168, 178, 190, 185, 170, 150, 140, 135],
}

const mockAlerts = [
  { id: 1, siteName: '科技园B区一期', type: 'PM2.5', value: 120, limit: 75, time: '2026-06-06 14:30:25', level: '严重' },
  { id: 2, siteName: '科技园B区一期', type: 'PM10', value: 200, limit: 150, time: '2026-06-06 14:30:25', level: '严重' },
  { id: 3, siteName: '中央公园A区工地', type: 'PM2.5', value: 75, limit: 75, time: '2026-06-06 13:15:08', level: '警告' },
  { id: 4, siteName: '地铁5号线施工现场', type: 'TSP', value: 145, limit: 150, time: '2026-06-06 12:45:33', level: '警告' },
  { id: 5, siteName: '中央公园A区工地', type: 'PM10', value: 120, limit: 150, time: '2026-06-06 11:20:10', level: '警告' },
]

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  const [siteId, setSiteId] = useState()
  const [dateRange, setDateRange] = useState()
  const [stats, setStats] = useState(mockDustStats)
  const [trendData, setTrendData] = useState(mockTrendData)
  const [alerts, setAlerts] = useState(mockAlerts)

  useEffect(() => {
    fetchData()
  }, [siteId, dateRange])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = {}
      if (siteId) params.siteId = siteId
      if (dateRange) {
        params.startTime = dateRange[0]?.format('YYYY-MM-DD')
        params.endTime = dateRange[1]?.format('YYYY-MM-DD')
      }
      const [sitesResp, trendResp, overResp] = await Promise.all([
        api.getConstructionSites().catch(() => null),
        api.getDustReadingTrend(params).catch(() => null),
        api.getOverlimitAlerts({ ...params, page: 1, size: 10 }).catch(() => null),
      ])
      if (sitesResp && sitesResp.code === 200 && sitesResp.data) {
        const sites = sitesResp.data
        const statsPromises = sites.map(async (s) => {
          try {
            const r = await api.getDustReadingStats({ siteId: s.id })
            const d = (r && r.data) || {}
            const pm25 = d.pm25Avg || 0
            const pm10 = d.pm10Avg || 0
            const tsp = d.tspAvg || 0
            let status = 'normal'
            if (pm25 > 75 || pm10 > 150 || tsp > 300) status = 'overlimit'
            else if (pm25 > 55 || pm10 > 110 || tsp > 220) status = 'warning'
            return { siteId: s.id, siteName: s.name, pm25, pm10, tsp, status }
          } catch {
            return { siteId: s.id, siteName: s.name, pm25: 0, pm10: 0, tsp: 0, status: 'normal' }
          }
        })
        const newStats = await Promise.all(statsPromises)
        if (newStats.length) setStats(newStats)
      }
      if (trendResp && trendResp.code === 200 && trendResp.data && trendResp.data.times) {
        setTrendData({
          times: trendResp.data.times,
          pm25: trendResp.data.pm25 || [],
          pm10: trendResp.data.pm10 || [],
          tsp: trendResp.data.tsp || [],
        })
      }
      if (overResp && overResp.code === 200 && overResp.data && overResp.data.list) {
        const newAlerts = overResp.data.list.map((r) => {
          const pm25Over = r.pm25 != null && r.pm25 > 75
          const pm10Over = r.pm10 != null && r.pm10 > 150
          const tspOver = r.tsp != null && r.tsp > 300
          let type = 'PM2.5', value = r.pm25 || 0, limit = 75
          if (pm25Over) { type = 'PM2.5'; value = r.pm25; limit = 75 }
          else if (pm10Over) { type = 'PM10'; value = r.pm10; limit = 150 }
          else if (tspOver) { type = 'TSP'; value = r.tsp; limit = 300 }
          const level = (type === 'PM2.5' && value > 100) || (type === 'PM10' && value > 200) || (type === 'TSP' && value > 400) ? '严重' : '警告'
          return {
            id: r.id,
            siteName: '工地#' + r.siteId,
            type,
            value,
            limit,
            time: r.readingTime,
            level,
          }
        })
        if (newAlerts.length) setAlerts(newAlerts)
      }
    } catch (e) {
      console.log('Using mock data:', e?.message)
    } finally {
      setLoading(false)
    }
  }

  const trendOption = {
    title: { text: '扬尘浓度趋势图', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['PM2.5', 'PM10', 'TSP'], bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: trendData.times },
    yAxis: { type: 'value', name: 'μg/m³' },
    series: [
      {
        name: 'PM2.5',
        type: 'line',
        smooth: true,
        data: trendData.pm25,
        itemStyle: { color: '#52c41a' },
        areaStyle: { opacity: 0.1 },
        markLine: { data: [{ yAxis: 75, name: 'PM2.5限值', lineStyle: { color: '#ff4d4f' } }] },
      },
      {
        name: 'PM10',
        type: 'line',
        smooth: true,
        data: trendData.pm10,
        itemStyle: { color: '#1890ff' },
        areaStyle: { opacity: 0.1 },
        markLine: { data: [{ yAxis: 150, name: 'PM10限值', lineStyle: { color: '#ff4d4f' } }] },
      },
      {
        name: 'TSP',
        type: 'line',
        smooth: true,
        data: trendData.tsp,
        itemStyle: { color: '#722ed1' },
        areaStyle: { opacity: 0.1 },
        markLine: { data: [{ yAxis: 200, name: 'TSP限值', lineStyle: { color: '#ff4d4f' } }] },
      },
    ],
  }

  const alertColumns = [
    { title: '工地名称', dataIndex: 'siteName', key: 'siteName' },
    { title: '超标类型', dataIndex: 'type', key: 'type' },
    {
      title: '监测值',
      dataIndex: 'value',
      key: 'value',
      render: (v, r) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{v} / {r.limit} μg/m³</span>,
    },
    {
      title: '告警等级',
      dataIndex: 'level',
      key: 'level',
      render: (v) => (
        <Tag color={v === '严重' ? 'red' : 'orange'} icon={<WarningOutlined />}>
          {v}
        </Tag>
      ),
    },
    { title: '时间', dataIndex: 'time', key: 'time' },
  ]

  const getStatusClass = (s) => (s === 'overlimit' ? 'overlimit' : s === 'warning' ? 'warning' : 'normal')

  return (
    <Spin spinning={loading}>
      <div className="page-header">
        <h2>工地监测仪表盘</h2>
      </div>

      <div className="filter-bar">
        <Row gutter={16} align="middle">
          <Col>
            <span style={{ marginRight: 8 }}>选择工地：</span>
            <Select
              placeholder="全部工地"
              style={{ width: 200 }}
              allowClear
              onChange={setSiteId}
              options={[
                { value: 1, label: '中央公园A区工地' },
                { value: 2, label: '滨江大道改造工程' },
                { value: 3, label: '科技园B区一期' },
                { value: 4, label: '地铁5号线施工现场' },
              ]}
            />
          </Col>
          <Col>
            <span style={{ marginRight: 8 }}>时间范围：</span>
            <RangePicker onChange={setDateRange} />
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]}>
        {stats.map((s) => (
          <Col span={6} key={s.siteId}>
            <Card>
              <Card.Meta title={s.siteName} />
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={8} className={`stat-card ${getStatusClass(s.status)}`}>
                  <Statistic title="PM2.5" value={s.pm25} suffix="μg/m³" />
                </Col>
                <Col span={8} className={`stat-card ${getStatusClass(s.status)}`}>
                  <Statistic title="PM10" value={s.pm10} suffix="μg/m³" />
                </Col>
                <Col span={8} className={`stat-card ${getStatusClass(s.status)}`}>
                  <Statistic title="TSP" value={s.tsp} suffix="μg/m³" />
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} className="dashboard-chart-card">
        <Col span={24}>
          <Card>
            <ReactECharts option={trendOption} style={{ height: 360 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="dashboard-chart-card">
        <Col span={24}>
          <Card title={<span><WarningOutlined /> 超标告警列表</span>}>
            <Table
              dataSource={alerts}
              columns={alertColumns}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  )
}

export default Dashboard
