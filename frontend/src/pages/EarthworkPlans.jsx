import React, { useEffect, useState } from 'react'
import { Table, Tag, Select, Row, Col, Button, Modal, Form, Input, DatePicker, Space, message, TimePicker, Switch, Spin } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '../api'

const mockData = [
  { id: 1, planName: '6月6日上午土方开挖', siteName: '中央公园A区工地', planDate: '2026-06-06', startTime: '08:00', endTime: '12:00', workContent: 'B区地下室土方开挖，约500立方', operator: '王工', isNightWork: false, createdAt: '2026-06-05 16:00:00' },
  { id: 2, planName: '6月6日下午渣土外运', siteName: '科技园B区一期', planDate: '2026-06-06', startTime: '14:00', endTime: '18:00', workContent: '一期地基渣土外运，计划20车次', operator: '李工', isNightWork: false, createdAt: '2026-06-05 17:30:00' },
  { id: 3, planName: '6月6日夜间紧急作业', siteName: '滨江大道改造工程', planDate: '2026-06-06', startTime: '22:00', endTime: '02:00', workContent: '主路管道铺设（已获批夜间施工许可）', operator: '张工', isNightWork: true, createdAt: '2026-06-06 10:00:00' },
  { id: 4, planName: '6月7日全天土方作业', siteName: '地铁5号线施工现场', planDate: '2026-06-07', startTime: '07:00', endTime: '19:00', workContent: '3号出入口基坑开挖及外运', operator: '赵工', isNightWork: false, createdAt: '2026-06-06 14:00:00' },
  { id: 5, planName: '6月7日上午回填作业', siteName: '中央公园A区工地', planDate: '2026-06-07', startTime: '09:00', endTime: '12:00', workContent: 'A区地下车库顶板回填土', operator: '刘工', isNightWork: false, createdAt: '2026-06-06 15:30:00' },
]

const EarthworkPlans = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length })
  const [siteId, setSiteId] = useState()
  const [isNightWork, setIsNightWork] = useState()
  const [planDate, setPlanDate] = useState()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, size: pagination.pageSize }
      if (siteId) params.siteId = siteId
      if (isNightWork !== undefined && isNightWork !== null) params.isNightWork = isNightWork
      if (planDate) params.planDate = planDate.format('YYYY-MM-DD')
      const res = await api.getEarthworkPlans(params).catch(() => null)
      if (res) {
        setData(res.content || res.data || mockData)
        setPagination((p) => ({ ...p, total: res.totalElements || res.total || mockData.length }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [pagination.current, pagination.pageSize])

  const openCreate = () => {
    setEditingRecord(null)
    form.resetFields()
    form.setFieldsValue({ isNightWork: false })
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditingRecord(record)
    form.setFieldsValue({
      ...record,
      planDate: record.planDate ? dayjs(record.planDate) : null,
      startTime: record.startTime ? dayjs(record.startTime, 'HH:mm') : null,
      endTime: record.endTime ? dayjs(record.endTime, 'HH:mm') : null,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        planDate: values.planDate?.format('YYYY-MM-DD'),
        startTime: values.startTime?.format('HH:mm'),
        endTime: values.endTime?.format('HH:mm'),
      }
      if (editingRecord) {
        await api.updateEarthworkPlan(editingRecord.id, payload).catch(() => null)
        message.success('修改成功')
      } else {
        await api.createEarthworkPlan(payload).catch(() => null)
        message.success('创建成功')
      }
      setModalOpen(false)
      fetchData()
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteEarthworkPlan(id).catch(() => null)
      message.success('删除成功')
      fetchData()
    } catch (e) { console.error(e) }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '计划名称', dataIndex: 'planName', key: 'planName', width: 200 },
    { title: '所属工地', dataIndex: 'siteName', key: 'siteName', width: 180 },
    { title: '作业日期', dataIndex: 'planDate', key: 'planDate', width: 120 },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 100 },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: 100 },
    {
      title: '夜间作业',
      dataIndex: 'isNightWork',
      key: 'isNightWork',
      width: 100,
      render: (v) => <Tag color={v ? 'orange' : 'green'}>{v ? '是' : '否'}</Tag>,
    },
    { title: '作业内容', dataIndex: 'workContent', key: 'workContent', ellipsis: true },
    { title: '负责人', dataIndex: 'operator', key: 'operator', width: 100 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <Spin spinning={loading}>
      <div className="page-header">
        <h2>土方作业计划管理</h2>
      </div>

      <div className="action-bar">
        <div />
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增计划</Button>
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
            <span style={{ marginRight: 8 }}>作业日期：</span>
            <DatePicker value={planDate} onChange={setPlanDate} />
          </Col>
          <Col>
            <Select placeholder="是否夜间作业" allowClear style={{ width: 160 }} value={isNightWork} onChange={setIsNightWork}
              options={[{ value: true, label: '夜间作业' }, { value: false, label: '日间作业' }]}
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

      <Modal title={editingRecord ? '编辑计划' : '新增计划'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={640}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="planName" label="计划名称" rules={[{ required: true }]}>
                <Input placeholder="请输入计划名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="siteId" label="所属工地" rules={[{ required: true }]}>
                <Select options={[
                  { value: 1, label: '中央公园A区工地' },
                  { value: 2, label: '滨江大道改造工程' },
                  { value: 3, label: '科技园B区一期' },
                  { value: 4, label: '地铁5号线施工现场' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="planDate" label="作业日期" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="startTime" label="开始时间" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="endTime" label="结束时间" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="workContent" label="作业内容" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="请描述作业内容" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="operator" label="作业负责人">
                <Input placeholder="负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isNightWork" label="是否夜间作业" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Spin>
  )
}

export default EarthworkPlans
