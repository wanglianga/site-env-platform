import React, { useEffect, useState } from 'react'
import { Table, Tag, Select, Row, Col, Button, Modal, Form, Input, Space, message, Input as AntInput, Spin } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import { api } from '../api'

const washStatusMap = {
  WASHED: { color: 'green', text: '已冲洗' },
  UNWASHED: { color: 'red', text: '未冲洗' },
  NOT_REQUIRED: { color: 'gray', text: '无需冲洗' },
}

const mockData = [
  { id: 1, plateNumber: '京A12345', siteName: '中央公园A区工地', driverName: '王师傅', transportTeam: '顺达运输队', route: '工地A - 消纳场1号', loadTime: '2026-06-06 08:15:00', washStatus: 'WASHED', createdAt: '2026-03-01 10:00:00' },
  { id: 2, plateNumber: '京B67890', siteName: '滨江大道改造工程', driverName: '李师傅', transportTeam: '宏运渣土', route: '工地B - 消纳场2号', loadTime: '2026-06-06 09:00:00', washStatus: 'UNWASHED', createdAt: '2026-03-15 14:30:00' },
  { id: 3, plateNumber: '京C11111', siteName: '科技园B区一期', driverName: '张师傅', transportTeam: '顺达运输队', route: '工地C - 消纳场1号', loadTime: '2026-06-06 22:30:00', washStatus: 'WASHED', createdAt: '2026-04-01 09:00:00' },
  { id: 4, plateNumber: '京D22222', siteName: '地铁5号线施工现场', driverName: '赵师傅', transportTeam: '铁军物流', route: '工地D - 消纳场3号', loadTime: '2026-06-06 07:30:00', washStatus: 'NOT_REQUIRED', createdAt: '2026-04-20 11:00:00' },
  { id: 5, plateNumber: '京E33333', siteName: '中央公园A区工地', driverName: '刘师傅', transportTeam: '宏运渣土', route: '工地A - 消纳场1号', loadTime: '2026-06-06 10:45:00', washStatus: 'WASHED', createdAt: '2026-05-01 15:00:00' },
]

const Vehicles = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length })
  const [plateNumber, setPlateNumber] = useState()
  const [siteId, setSiteId] = useState()
  const [washStatus, setWashStatus] = useState()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, size: pagination.pageSize }
      if (plateNumber) params.plateNumber = plateNumber
      if (siteId) params.siteId = siteId
      if (washStatus) params.washStatus = washStatus
      const res = await api.getVehicles(params).catch(() => null)
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
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingRecord) {
        await api.updateVehicle(editingRecord.id, values).catch(() => null)
        message.success('修改成功')
      } else {
        await api.createVehicle(values).catch(() => null)
        message.success('创建成功')
      }
      setModalOpen(false)
      fetchData()
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteVehicle(id).catch(() => null)
      message.success('删除成功')
      fetchData()
    } catch (e) { console.error(e) }
  }

  const handleSearch = () => {
    setPagination((p) => ({ ...p, current: 1 }))
    fetchData()
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '车牌号', dataIndex: 'plateNumber', key: 'plateNumber', width: 120 },
    { title: '所属工地', dataIndex: 'siteName', key: 'siteName', width: 180 },
    { title: '驾驶员', dataIndex: 'driverName', key: 'driverName', width: 100 },
    { title: '运输车队', dataIndex: 'transportTeam', key: 'transportTeam', width: 140 },
    { title: '运输路线', dataIndex: 'route', key: 'route', width: 200 },
    { title: '装车时间', dataIndex: 'loadTime', key: 'loadTime', width: 170 },
    {
      title: '冲洗状态',
      dataIndex: 'washStatus',
      key: 'washStatus',
      width: 100,
      render: (v) => {
        const s = washStatusMap[v] || { color: 'default', text: v }
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
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
        <h2>渣土车管理</h2>
      </div>

      <div className="action-bar">
        <div />
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增车辆</Button>
      </div>

      <div className="filter-bar">
        <Row gutter={[16, 16]}>
          <Col>
            <AntInput placeholder="车牌号" prefix={<SearchOutlined />} allowClear value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} style={{ width: 180 }} onPressEnter={handleSearch} />
          </Col>
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
            <Select placeholder="冲洗状态" allowClear style={{ width: 160 }} value={washStatus} onChange={setWashStatus}
              options={Object.keys(washStatusMap).map((k) => ({ value: k, label: washStatusMap[k].text }))}
            />
          </Col>
          <Col>
            <Button type="primary" onClick={handleSearch}>查询</Button>
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

      <Modal title={editingRecord ? '编辑车辆' : '新增车辆'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={640}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="plateNumber" label="车牌号" rules={[{ required: true }]}>
                <Input placeholder="请输入车牌号" />
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
            <Col span={12}>
              <Form.Item name="driverName" label="驾驶员姓名">
                <Input placeholder="驾驶员姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="transportTeam" label="运输车队">
                <Input placeholder="运输车队名称" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="route" label="运输路线">
            <Input placeholder="例如：工地A - 消纳场1号" />
          </Form.Item>
          <Form.Item name="washStatus" label="冲洗状态" rules={[{ required: true }]}>
            <Select options={Object.keys(washStatusMap).map((k) => ({ value: k, label: washStatusMap[k].text }))} />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  )
}

export default Vehicles
