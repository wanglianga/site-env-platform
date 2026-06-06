import React, { useEffect, useState } from 'react'
import { Table, Tag, Select, Row, Col, Button, Modal, Descriptions, Spin } from 'antd'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { api } from '../api'

const statusMap = {
  ISSUED: { color: 'orange', text: '已开具' },
  PAID: { color: 'blue', text: '已缴纳' },
  ARCHIVED: { color: 'green', text: '已归档' },
  CANCELLED: { color: 'default', text: '已取消' },
}

const typeMap = {
  FINE: '罚款',
  WARNING: '警告',
  SUSPENSION: '停工整改',
  DEMERIT: '扣分',
}

const mockData = [
  { id: 1, penaltyNo: 'CF20260606001', siteName: '科技园B区一期', taskId: 1, taskTitle: 'PM2.5严重超标', type: 'FINE', title: '扬尘超标罚款', description: 'PM2.5浓度超过限值60%', amount: 5000, status: 'ISSUED', penalizedParty: '科技园B区一期项目部', issuer: '环保执法大队', issuedAt: '2026-06-06 15:00:00' },
  { id: 2, penaltyNo: 'CF20260606002', siteName: '滨江大道改造工程', taskId: 2, taskTitle: '出场车辆未冲洗', type: 'WARNING', title: '车辆未冲洗警告', description: '多次出现车辆未冲洗出场情况', amount: 0, status: 'ISSUED', penalizedParty: '滨江大道项目部', issuer: '环保执法大队', issuedAt: '2026-06-06 10:30:00' },
  { id: 3, penaltyNo: 'CF20260605001', siteName: '中央公园A区工地', taskId: 3, taskTitle: '施工围挡破损', type: 'FINE', title: '围挡破损罚款', description: '围挡破损未及时修复', amount: 2000, status: 'PAID', penalizedParty: '中央公园A区项目部', issuer: '环保执法大队', issuedAt: '2026-06-05 17:00:00', paidAt: '2026-06-06 09:00:00' },
  { id: 4, penaltyNo: 'CF20260604001', siteName: '地铁5号线施工现场', taskId: 5, taskTitle: '夜间施工噪声', type: 'SUSPENSION', title: '夜间违规施工停工', description: '夜间违规进行混凝土浇筑', amount: 0, status: 'ARCHIVED', penalizedParty: '地铁5号线项目部', issuer: '环保执法大队', issuedAt: '2026-06-04 08:00:00', paidAt: '2026-06-04 18:00:00', archivedAt: '2026-06-05 12:00:00' },
]

const Penalties = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length })
  const [status, setStatus] = useState()
  const [siteId, setSiteId] = useState()
  const [type, setType] = useState()
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedPenalty, setSelectedPenalty] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, size: pagination.pageSize }
      if (status) params.status = status
      if (siteId) params.siteId = siteId
      if (type) params.type = type
      const res = await api.getPenalties(params).catch(() => null)
      if (res) {
        setData(res.content || res.data || mockData)
        setPagination((p) => ({ ...p, total: res.totalElements || res.total || mockData.length }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [pagination.current, pagination.pageSize, status, siteId, type])

  const openDetail = (record) => {
    setSelectedPenalty(record)
    setDetailModalOpen(true)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '处罚编号', dataIndex: 'penaltyNo', key: 'penaltyNo', width: 140 },
    { title: '工地名称', dataIndex: 'siteName', key: 'siteName', width: 180 },
    { title: '关联任务', dataIndex: 'taskTitle', key: 'taskTitle', width: 180 },
    {
      title: '处罚类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (v) => typeMap[v] || v,
    },
    { title: '处罚标题', dataIndex: 'title', key: 'title', width: 160 },
    {
      title: '处罚金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (v) => v > 0 ? `¥${Number(v).toLocaleString()}` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v) => {
        const s = statusMap[v] || { color: 'default', text: v }
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
    { title: '被处罚方', dataIndex: 'penalizedParty', key: 'penalizedParty', width: 180 },
    { title: '开具时间', dataIndex: 'issuedAt', key: 'issuedAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => openDetail(record)}>详情</Button>
      ),
    },
  ]

  return (
    <Spin spinning={loading}>
      <div className="page-header">
        <h2>处罚管理</h2>
      </div>

      <div className="filter-bar">
        <Row gutter={[16, 16]}>
          <Col>
            <Select placeholder="选择工地" allowClear style={{ width: 200 }} value={siteId} onChange={setSiteId}
              options={[
                { value: 1, label: '中央公园A区工地' },
                { value: 2, label: '滨江大道改造工程' },
                { value: 3, label: '科技园B区一期' },
                { value: 4, label: '地铁5号线施工现场' },
              ]}
            />
          </Col>
          <Col>
            <Select placeholder="处罚类型" allowClear style={{ width: 160 }} value={type} onChange={setType}
              options={Object.keys(typeMap).map((k) => ({ value: k, label: typeMap[k] }))}
            />
          </Col>
          <Col>
            <Select placeholder="状态" allowClear style={{ width: 160 }} value={status} onChange={setStatus}
              options={Object.keys(statusMap).map((k) => ({ value: k, label: statusMap[k].text }))}
            />
          </Col>
        </Row>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={pagination}
        onChange={(p) => setPagination(p)}
      />

      <Modal title="处罚详情" open={detailModalOpen} onCancel={() => setDetailModalOpen(false)} footer={null} width={720}>
        {selectedPenalty && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="处罚编号">{selectedPenalty.penaltyNo}</Descriptions.Item>
            <Descriptions.Item label="处罚类型">{typeMap[selectedPenalty.type]}</Descriptions.Item>
            <Descriptions.Item label="工地名称">{selectedPenalty.siteName}</Descriptions.Item>
            <Descriptions.Item label="关联任务">{selectedPenalty.taskTitle}</Descriptions.Item>
            <Descriptions.Item label="处罚标题" span={2}>{selectedPenalty.title}</Descriptions.Item>
            <Descriptions.Item label="处罚描述" span={2}>{selectedPenalty.description}</Descriptions.Item>
            <Descriptions.Item label="处罚金额">{selectedPenalty.amount > 0 ? `¥${Number(selectedPenalty.amount).toLocaleString()}` : '-'}</Descriptions.Item>
            <Descriptions.Item label="状态"><Tag color={statusMap[selectedPenalty.status]?.color}>{statusMap[selectedPenalty.status]?.text}</Tag></Descriptions.Item>
            <Descriptions.Item label="被处罚方">{selectedPenalty.penalizedParty}</Descriptions.Item>
            <Descriptions.Item label="开具人">{selectedPenalty.issuer}</Descriptions.Item>
            <Descriptions.Item label="开具时间">{selectedPenalty.issuedAt}</Descriptions.Item>
            <Descriptions.Item label="缴纳时间">{selectedPenalty.paidAt || '-'}</Descriptions.Item>
            <Descriptions.Item label="归档时间">{selectedPenalty.archivedAt || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Spin>
  )
}

export default Penalties
