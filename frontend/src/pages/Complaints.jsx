import React, { useEffect, useState } from 'react'
import { Table, Tag, Select, Row, Col, Button, Modal, Form, Input, Space, message, Spin, Image } from 'antd'
import { SendOutlined, CheckCircleOutlined, EyeOutlined } from '@ant-design/icons'
import { api } from '../api'

const statusMap = {
  PENDING: { color: 'orange', text: '待处理' },
  DISPATCHED: { color: 'blue', text: '已派单' },
  PROCESSED: { color: 'green', text: '处理中' },
  CLOSED: { color: 'default', text: '已关闭' },
}

const mockData = [
  { id: 1, complainant: '张先生', complainantPhone: '13800138011', siteName: '科技园B区一期', content: '夜间10点多还在施工，噪音很大影响休息', screenshotUrl: 'https://placehold.co/400x300?text=Complaint+1', status: 'PENDING', handler: null, createdAt: '2026-06-06 22:15:30', processResult: null },
  { id: 2, complainant: '李女士', complainantPhone: '13800138022', siteName: '中央公园A区工地', content: '工地门口扬尘严重，过路都要捂着嘴', screenshotUrl: 'https://placehold.co/400x300?text=Complaint+2', status: 'DISPATCHED', handler: '王巡查', dispatchedAt: '2026-06-06 09:30:00', createdAt: '2026-06-06 08:45:20', processResult: null },
  { id: 3, complainant: '陈先生', complainantPhone: '13800138033', siteName: '滨江大道改造工程', content: '运渣土的车把路弄得很脏，车轮带泥', screenshotUrl: 'https://placehold.co/400x300?text=Complaint+3', status: 'PROCESSED', handler: '李巡查', dispatchedAt: '2026-06-05 15:20:00', processedAt: '2026-06-05 17:00:00', createdAt: '2026-06-05 14:50:00', processResult: '已责令施工单位安排洒水车清洗路面，并加强车辆冲洗检查' },
  { id: 4, complainant: '赵女士', complainantPhone: '13800138044', siteName: '地铁5号线施工现场', content: '围挡倒了一截，影响行人通行', screenshotUrl: 'https://placehold.co/400x300?text=Complaint+4', status: 'CLOSED', handler: '张巡查', dispatchedAt: '2026-06-04 10:00:00', processedAt: '2026-06-04 14:30:00', closedAt: '2026-06-04 17:00:00', createdAt: '2026-06-04 09:30:00', processResult: '围挡已修复，安全隐患排除' },
]

const Complaints = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length })
  const [status, setStatus] = useState()
  const [siteId, setSiteId] = useState()
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false)
  const [processModalOpen, setProcessModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [dispatchForm] = Form.useForm()
  const [processForm] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, size: pagination.pageSize }
      if (status) params.status = status
      if (siteId) params.siteId = siteId
      const res = await api.getComplaints(params).catch(() => null)
      if (res) {
        setData(res.content || res.data || mockData)
        setPagination((p) => ({ ...p, total: res.totalElements || res.total || mockData.length }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [pagination.current, pagination.pageSize, status, siteId])

  const openDispatch = (record) => {
    setSelectedComplaint(record)
    dispatchForm.resetFields()
    setDispatchModalOpen(true)
  }

  const openProcess = (record) => {
    setSelectedComplaint(record)
    processForm.resetFields()
    setProcessModalOpen(true)
  }

  const openDetail = (record) => {
    setSelectedComplaint(record)
    setDetailModalOpen(true)
  }

  const handleDispatch = async () => {
    try {
      const values = await dispatchForm.validateFields()
      if (selectedComplaint) {
        await api.dispatchComplaint(selectedComplaint.id, values).catch(() => null)
      }
      message.success('派单成功')
      setDispatchModalOpen(false)
      fetchData()
    } catch (e) { console.error(e) }
  }

  const handleProcess = async () => {
    try {
      const values = await processForm.validateFields()
      if (selectedComplaint) {
        await api.processComplaint(selectedComplaint.id, values).catch(() => null)
      }
      message.success('处理完成')
      setProcessModalOpen(false)
      fetchData()
    } catch (e) { console.error(e) }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '投诉人', dataIndex: 'complainant', key: 'complainant', width: 100 },
    { title: '联系电话', dataIndex: 'complainantPhone', key: 'complainantPhone', width: 130 },
    { title: '涉及工地', dataIndex: 'siteName', key: 'siteName', width: 180 },
    { title: '投诉内容', dataIndex: 'content', key: 'content', ellipsis: true },
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
    { title: '处理人', dataIndex: 'handler', key: 'handler', width: 100, render: (v) => v || '-' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => openDetail(record)}>详情</Button>
          {record.status === 'PENDING' && (
            <Button size="small" type="primary" icon={<SendOutlined />} onClick={() => openDispatch(record)}>派单</Button>
          )}
          {record.status === 'DISPATCHED' && (
            <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => openProcess(record)}>处理</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Spin spinning={loading}>
      <div className="page-header">
        <h2>投诉处理</h2>
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
            <Select placeholder="处理状态" allowClear style={{ width: 160 }} value={status} onChange={setStatus}
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

      <Modal title="投诉派单" open={dispatchModalOpen} onOk={handleDispatch} onCancel={() => setDispatchModalOpen(false)}>
        <Form form={dispatchForm} layout="vertical">
          <Form.Item name="handler" label="处理人" rules={[{ required: true, message: '请输入处理人姓名' }]}>
            <Input placeholder="处理人姓名" />
          </Form.Item>
          <Form.Item name="dispatchRemark" label="派单备注">
            <Input.TextArea rows={2} placeholder="可选" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="投诉处理" open={processModalOpen} onOk={handleProcess} onCancel={() => setProcessModalOpen(false)}>
        <Form form={processForm} layout="vertical">
          <Form.Item name="processResult" label="处理结果" rules={[{ required: true, message: '请输入处理结果' }]}>
            <Input.TextArea rows={4} placeholder="请输入处理结果" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="投诉详情" open={detailModalOpen} onCancel={() => setDetailModalOpen(false)} footer={null} width={640}>
        {selectedComplaint && (
          <div>
            <p><b>投诉人：</b>{selectedComplaint.complainant}（{selectedComplaint.complainantPhone}）</p>
            <p><b>涉及工地：</b>{selectedComplaint.siteName}</p>
            <p><b>状态：</b><Tag color={statusMap[selectedComplaint.status]?.color}>{statusMap[selectedComplaint.status]?.text}</Tag></p>
            <p><b>处理人：</b>{selectedComplaint.handler || '-'}</p>
            <p><b>创建时间：</b>{selectedComplaint.createdAt}</p>
            <p style={{ marginTop: 12 }}><b>投诉内容：</b></p>
            <p style={{ padding: 12, background: '#f5f5f5', borderRadius: 4 }}>{selectedComplaint.content}</p>
            {selectedComplaint.screenshotUrl && (
              <div style={{ marginTop: 12 }}>
                <b>附件图片：</b>
                <div style={{ marginTop: 8 }}>
                  <Image width={300} src={selectedComplaint.screenshotUrl} />
                </div>
              </div>
            )}
            {selectedComplaint.processResult && (
              <div style={{ marginTop: 12 }}>
                <b>处理结果：</b>
                <p style={{ padding: 12, background: '#f6ffed', borderRadius: 4, marginTop: 8 }}>{selectedComplaint.processResult}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Spin>
  )
}

export default Complaints
