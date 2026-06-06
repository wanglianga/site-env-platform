import React, { useEffect, useState } from 'react'
import { Table, Tag, Select, Button, Row, Col, Modal, Form, Input, DatePicker, Space, message, Spin } from 'antd'
import { PlusOutlined, CheckOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '../api'

const statusMap = {
  PENDING: { color: 'orange', text: '待整改' },
  IN_PROGRESS: { color: 'blue', text: '整改中' },
  SUBMITTED: { color: 'purple', text: '待复查' },
  PASSED: { color: 'green', text: '已通过' },
  REJECTED: { color: 'red', text: '已驳回' },
  CANCELLED: { color: 'default', text: '已取消' },
}

const typeMap = {
  DUST: '扬尘超标',
  NOISE: '噪声污染',
  WASH: '车辆未冲洗',
  ENCLOSURE: '围挡破损',
  SPRINKLER: '喷淋故障',
  OTHER: '其他问题',
}

const mockData = [
  { id: 1, siteName: '科技园B区一期', type: 'DUST', title: 'PM2.5严重超标', description: '扬尘监测点PM2.5达到120μg/m³，超出限值60%', source: '自动监测', initiator: '系统', rectificationPerson: '张三', personPhone: '13800138001', status: 'PENDING', deadline: '2026-06-08 18:00:00', createdAt: '2026-06-06 14:30:00' },
  { id: 2, siteName: '滨江大道改造工程', type: 'WASH', title: '出场车辆未冲洗', description: '车牌京B67890出场时未经过冲洗设备', source: '车辆抓拍', initiator: '系统', rectificationPerson: '李四', personPhone: '13800138002', status: 'IN_PROGRESS', deadline: '2026-06-07 12:00:00', createdAt: '2026-06-06 09:15:00' },
  { id: 3, siteName: '中央公园A区工地', type: 'ENCLOSURE', title: '施工围挡破损', description: '南侧围挡约5米长出现破损，存在安全隐患', source: '巡查发现', initiator: '王巡查', rectificationPerson: '赵五', personPhone: '13800138003', status: 'SUBMITTED', deadline: '2026-06-07 18:00:00', createdAt: '2026-06-05 16:20:00' },
  { id: 4, siteName: '地铁5号线施工现场', type: 'SPRINKLER', title: '喷淋设备故障', description: '东区3号喷淋设备无法正常工作', source: '设备告警', initiator: '系统', rectificationPerson: '孙六', personPhone: '13800138004', status: 'PASSED', deadline: '2026-06-05 12:00:00', createdAt: '2026-06-04 10:00:00' },
  { id: 5, siteName: '科技园B区一期', type: 'NOISE', title: '夜间施工噪声', description: '22点后仍在进行混凝土浇筑作业', source: '投诉举报', initiator: '周边居民', rectificationPerson: '周七', personPhone: '13800138005', status: 'REJECTED', deadline: '2026-06-06 08:00:00', createdAt: '2026-06-06 07:30:00' },
]

const RectificationTasks = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length })
  const [status, setStatus] = useState()
  const [siteId, setSiteId] = useState()
  const [type, setType] = useState()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [createForm] = Form.useForm()
  const [reviewForm] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, size: pagination.pageSize }
      if (status) params.status = status
      if (siteId) params.siteId = siteId
      if (type) params.type = type
      const res = await api.getRectificationTasks(params).catch(() => null)
      if (res) {
        setData(res.content || res.data || mockData)
        setPagination((p) => ({ ...p, total: res.totalElements || res.total || mockData.length }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [pagination.current, pagination.pageSize, status, siteId, type])

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields()
      const payload = { ...values, deadline: values.deadline?.format('YYYY-MM-DD HH:mm:ss') }
      await api.createRectificationTask(payload).catch(() => null)
      message.success('整改任务创建成功')
      setCreateModalOpen(false)
      createForm.resetFields()
      fetchData()
    } catch (e) {
      console.error(e)
    }
  }

  const handleReview = async (passed) => {
    try {
      const values = await reviewForm.validateFields()
      if (selectedTask) {
        await api.reviewRectification(selectedTask.id, { ...values, passed }).catch(() => null)
      }
      message.success(passed ? '复查通过' : '已驳回')
      setReviewModalOpen(false)
      reviewForm.resetFields()
      fetchData()
    } catch (e) {
      console.error(e)
    }
  }

  const openReviewModal = (record) => {
    setSelectedTask(record)
    reviewForm.resetFields()
    setReviewModalOpen(true)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '工地名称', dataIndex: 'siteName', key: 'siteName', width: 180 },
    {
      title: '问题类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (v) => typeMap[v] || v,
    },
    { title: '标题', dataIndex: 'title', key: 'title', width: 200 },
    { title: '整改负责人', dataIndex: 'rectificationPerson', key: 'rectificationPerson', width: 100 },
    { title: '联系电话', dataIndex: 'personPhone', key: 'personPhone', width: 130 },
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
    { title: '截止时间', dataIndex: 'deadline', key: 'deadline', width: 170 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>详情</Button>
          {record.status === 'SUBMITTED' && (
            <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => openReviewModal(record)}>复查</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Spin spinning={loading}>
      <div className="page-header">
        <h2>整改任务中心</h2>
      </div>

      <div className="action-bar">
        <div />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>发起整改</Button>
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
            <Select placeholder="问题类型" allowClear style={{ width: 160 }} value={type} onChange={setType}
              options={Object.keys(typeMap).map((k) => ({ value: k, label: typeMap[k] }))}
            />
          </Col>
          <Col>
            <Select placeholder="任务状态" allowClear style={{ width: 160 }} value={status} onChange={setStatus}
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

      <Modal title="发起整改任务" open={createModalOpen} onOk={handleCreateSubmit} onCancel={() => setCreateModalOpen(false)} width={640}>
        <Form form={createForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="siteId" label="选择工地" rules={[{ required: true }]}>
                <Select options={[
                  { value: 1, label: '中央公园A区工地' },
                  { value: 2, label: '滨江大道改造工程' },
                  { value: 3, label: '科技园B区一期' },
                  { value: 4, label: '地铁5号线施工现场' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="问题类型" rules={[{ required: true }]}>
                <Select options={Object.keys(typeMap).map((k) => ({ value: k, label: typeMap[k] }))} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input placeholder="请输入整改标题" />
          </Form.Item>
          <Form.Item name="description" label="详细描述" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="请输入详细描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="rectificationPerson" label="整改负责人" rules={[{ required: true }]}>
                <Input placeholder="姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="personPhone" label="联系电话" rules={[{ required: true }]}>
                <Input placeholder="手机号" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="deadline" label="整改截止时间" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="source" label="来源">
            <Input placeholder="例如：自动监测、巡查发现等" />
          </Form.Item>
          <Form.Item name="initiator" label="发起人">
            <Input placeholder="发起人姓名" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="复查整改任务" open={reviewModalOpen} onCancel={() => setReviewModalOpen(false)} footer={[
        <Button key="reject" danger onClick={() => handleReview(false)}>驳回</Button>,
        <Button key="pass" type="primary" onClick={() => handleReview(true)}>通过</Button>,
      ]}>
        <p style={{ marginBottom: 16 }}>任务：<b>{selectedTask?.title}</b></p>
        <Form form={reviewForm} layout="vertical">
          <Form.Item name="reviewComment" label="复查意见" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="请输入复查意见" />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  )
}

export default RectificationTasks
