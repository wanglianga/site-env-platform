import React, { useEffect, useState } from 'react'
import { Table, Tag, Select, Row, Col, Button, Modal, Form, Input, DatePicker, TimePicker, Space, Descriptions, message, Spin } from 'antd'
import { PlusOutlined, CheckOutlined, CloseOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '../api'

const statusMap = {
  PENDING: { color: 'orange', text: '待审批' },
  APPROVED: { color: 'green', text: '已通过' },
  REJECTED: { color: 'red', text: '已拒绝' },
}

const siteOptions = [
  { value: 1, label: '中央公园A区工地' },
  { value: 2, label: '滨江大道改造工程' },
  { value: 3, label: '科技园B区一期' },
  { value: 4, label: '地铁5号线施工现场' },
]

const getSiteName = (id) => {
  const s = siteOptions.find((o) => o.value === id)
  return s?.label || `工地${id}`
}

const mockData = [
  { id: 1, approvalNo: 'NEA-1717600001', siteId: 1, workDate: '2026-06-06', startTime: '22:00', endTime: '02:00', route: '工地东门→滨江大道→绕城高速→渣土消纳场', vehicleList: '京A12345,京A23456,京A34567', dustControlMeasures: '1. 出入口安装自动冲洗设备；2. 全程密闭运输；3. 沿途洒水降尘；4. 消纳场喷淋', applicant: '王工', applicantContact: '13800138001', status: 'PENDING', createdAt: '2026-06-06 10:00:00' },
  { id: 2, approvalNo: 'NEA-1717600002', siteId: 2, workDate: '2026-06-06', startTime: '22:30', endTime: '03:00', route: '工地南门→科技路→北环大道→指定消纳场', vehicleList: '京B67890,京B78901', dustControlMeasures: '1. 车辆出场全覆盖冲洗；2. 运输路线每日洒水3次；3. 车辆顶棚密闭', applicant: '李工', applicantContact: '13800138002', status: 'APPROVED', reviewer: '张主任', reviewComment: '降尘措施完善，同意夜间作业', reviewedAt: '2026-06-06 14:30:00', createdAt: '2026-06-06 11:20:00' },
  { id: 3, approvalNo: 'NEA-1717600003', siteId: 3, workDate: '2026-06-05', startTime: '23:00', endTime: '01:00', route: '工地→主路→郊野消纳场', vehicleList: '京C11111', dustControlMeasures: '车辆冲洗', applicant: '赵工', applicantContact: '13800138003', status: 'REJECTED', reviewer: '刘主任', reviewComment: '降尘措施不够完善，请补充详细方案后重新申请', reviewedAt: '2026-06-05 16:00:00', createdAt: '2026-06-05 14:00:00' },
]

const NightExcavationApprovals = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length })
  const [siteId, setSiteId] = useState()
  const [status, setStatus] = useState()
  const [modalOpen, setModalOpen] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [reviewRecord, setReviewRecord] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [reviewAction, setReviewAction] = useState(null)
  const [form] = Form.useForm()
  const [reviewForm] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, size: pagination.pageSize }
      if (siteId) params.siteId = siteId
      if (status) params.status = status
      const res = await api.getNightExcavationApprovals(params).catch(() => null)
      if (res) {
        setData(res.content || res.data || mockData)
        setPagination((p) => ({ ...p, total: res.totalElements || res.total || mockData.length }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [pagination.current, pagination.pageSize, siteId, status])

  const openCreate = () => {
    setEditingRecord(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditingRecord(record)
    form.setFieldsValue({
      ...record,
      workDate: record.workDate ? dayjs(record.workDate) : null,
      startTime: record.startTime ? dayjs(record.startTime, 'HH:mm') : null,
      endTime: record.endTime ? dayjs(record.endTime, 'HH:mm') : null,
    })
    setModalOpen(true)
  }

  const openDetail = (record) => {
    setSelectedRecord(record)
    setDetailModalOpen(true)
  }

  const openReview = (record, action) => {
    setReviewRecord(record)
    setReviewAction(action)
    reviewForm.resetFields()
    setReviewModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        workDate: values.workDate?.format('YYYY-MM-DD'),
        startTime: values.startTime?.format('HH:mm'),
        endTime: values.endTime?.format('HH:mm'),
      }
      if (editingRecord) {
        await api.updateNightExcavationApproval(editingRecord.id, payload).catch(() => null)
        message.success('修改成功')
      } else {
        await api.createNightExcavationApproval(payload).catch(() => null)
        message.success('申请已提交')
      }
      setModalOpen(false)
      fetchData()
    } catch (e) { console.error(e) }
  }

  const handleReviewSubmit = async () => {
    try {
      const values = await reviewForm.validateFields()
      if (reviewAction === 'approve') {
        await api.approveNightExcavation(reviewRecord.id, values).catch(() => null)
        message.success('审批通过')
      } else {
        await api.rejectNightExcavation(reviewRecord.id, values).catch(() => null)
        message.success('已拒绝')
      }
      setReviewModalOpen(false)
      fetchData()
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteNightExcavationApproval(id).catch(() => null)
      message.success('删除成功')
      fetchData()
    } catch (e) { console.error(e) }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '审批编号', dataIndex: 'approvalNo', key: 'approvalNo', width: 160 },
    { title: '所属工地', dataIndex: 'siteId', key: 'siteId', width: 180, render: (v) => getSiteName(v) },
    { title: '作业日期', dataIndex: 'workDate', key: 'workDate', width: 120 },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 100 },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: 100 },
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
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 100 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 260,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => openDetail(record)}>详情</Button>
          {record.status === 'PENDING' && (
            <>
              <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => openReview(record, 'approve')}>通过</Button>
              <Button size="small" danger icon={<CloseOutlined />} onClick={() => openReview(record, 'reject')}>拒绝</Button>
            </>
          )}
          {record.status !== 'APPROVED' && (
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Spin spinning={loading}>
      <div className="page-header">
        <h2>夜间出土审批管理</h2>
      </div>

      <div className="action-bar">
        <div />
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增申请</Button>
      </div>

      <div className="filter-bar">
        <Row gutter={[16, 16]}>
          <Col>
            <Select placeholder="选择工地" allowClear style={{ width: 200 }} value={siteId} onChange={setSiteId} options={siteOptions} />
          </Col>
          <Col>
            <Select placeholder="审批状态" allowClear style={{ width: 160 }} value={status} onChange={setStatus}
              options={Object.keys(statusMap).map((k) => ({ value: k, label: statusMap[k].text }))}
            />
          </Col>
          <Col>
            <Button type="primary" onClick={() => { setPagination((p) => ({ ...p, current: 1 })); fetchData() }}>查询</Button>
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

      <Modal title={editingRecord ? '编辑申请' : '新增夜间出土申请'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={720} okText="提交">
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="siteId" label="所属工地" rules={[{ required: true, message: '请选择工地' }]}>
                <Select options={siteOptions} placeholder="请选择工地" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="workDate" label="作业日期" rules={[{ required: true, message: '请选择作业日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="开始时间" rules={[{ required: true, message: '请选择开始时间' }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束时间" rules={[{ required: true, message: '请选择结束时间' }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="route" label="运输路线" rules={[{ required: true, message: '请填写运输路线' }]}>
            <Input.TextArea rows={2} placeholder="请描述运输路线，例如：工地东门→XX路→XX消纳场" />
          </Form.Item>
          <Form.Item name="vehicleList" label="车辆清单" rules={[{ required: true, message: '请填写车辆清单' }]}>
            <Input.TextArea rows={2} placeholder="请输入车牌号码，多个用逗号或空格分隔，例如：京A12345,京A23456" />
          </Form.Item>
          <Form.Item name="dustControlMeasures" label="降尘措施" rules={[{ required: true, message: '请填写降尘措施' }]}>
            <Input.TextArea rows={4} placeholder="请详细描述降尘措施，如冲洗设备、密闭运输、洒水降尘等" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="applicant" label="申请人">
                <Input placeholder="申请人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="applicantContact" label="联系电话">
                <Input placeholder="联系电话" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal title={reviewAction === 'approve' ? '审批通过' : '审批拒绝'} open={reviewModalOpen} onOk={handleReviewSubmit} onCancel={() => setReviewModalOpen(false)} width={520}>
        <Form form={reviewForm} layout="vertical">
          <Form.Item name="reviewer" label="审批人">
            <Input placeholder="审批人姓名" defaultValue="系统管理员" />
          </Form.Item>
          <Form.Item name="comment" label={reviewAction === 'approve' ? '通过意见' : '拒绝理由'} rules={reviewAction === 'reject' ? [{ required: true, message: '请填写拒绝理由' }] : []}>
            <Input.TextArea rows={4} placeholder={reviewAction === 'approve' ? '请填写审批意见（选填）' : '请填写拒绝理由'} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="审批详情" open={detailModalOpen} onCancel={() => setDetailModalOpen(false)} footer={null} width={760}>
        {selectedRecord && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="审批编号">{selectedRecord.approvalNo}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[selectedRecord.status]?.color}>{statusMap[selectedRecord.status]?.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="所属工地">{getSiteName(selectedRecord.siteId)}</Descriptions.Item>
            <Descriptions.Item label="作业日期">{selectedRecord.workDate}</Descriptions.Item>
            <Descriptions.Item label="开始时间">{selectedRecord.startTime}</Descriptions.Item>
            <Descriptions.Item label="结束时间">{selectedRecord.endTime}</Descriptions.Item>
            <Descriptions.Item label="运输路线" span={2}>{selectedRecord.route}</Descriptions.Item>
            <Descriptions.Item label="车辆清单" span={2}>{selectedRecord.vehicleList}</Descriptions.Item>
            <Descriptions.Item label="降尘措施" span={2}>{selectedRecord.dustControlMeasures}</Descriptions.Item>
            <Descriptions.Item label="申请人">{selectedRecord.applicant || '-'}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{selectedRecord.applicantContact || '-'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{selectedRecord.createdAt}</Descriptions.Item>
            <Descriptions.Item label="审批人">{selectedRecord.reviewer || '-'}</Descriptions.Item>
            <Descriptions.Item label="审批时间">{selectedRecord.reviewedAt || '-'}</Descriptions.Item>
            <Descriptions.Item label="审批意见" span={2}>{selectedRecord.reviewComment || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Spin>
  )
}

export default NightExcavationApprovals
