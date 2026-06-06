import React, { useEffect, useState } from 'react'
import { Table, Tag, Select, Row, Col, Button, Modal, Form, Input, Space, message, Spin } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { api } from '../api'

const enclosureStatusMap = {
  GOOD: { color: 'green', text: '完好' },
  DAMAGED: { color: 'red', text: '破损' },
  UNDER_REPAIR: { color: 'orange', text: '维修中' },
}

const sprinklerStatusMap = {
  NORMAL: { color: 'green', text: '正常' },
  FAULTY: { color: 'red', text: '故障' },
  OFFLINE: { color: 'gray', text: '离线' },
}

const mockData = [
  { id: 1, name: '中央公园A区工地', address: '中央公园东路1号', constructionUnit: '建工集团第一公司', responsiblePerson: '王经理', contactPhone: '13900139001', enclosureStatus: 'GOOD', sprinklerStatus: 'NORMAL', rectificationManager: '赵五', managerPhone: '13800138003', createdAt: '2026-01-15 09:00:00' },
  { id: 2, name: '滨江大道改造工程', address: '滨江大道沿线', constructionUnit: '市政工程总公司', responsiblePerson: '李经理', contactPhone: '13900139002', enclosureStatus: 'GOOD', sprinklerStatus: 'FAULTY', rectificationManager: '李四', managerPhone: '13800138002', createdAt: '2026-02-20 10:30:00' },
  { id: 3, name: '科技园B区一期', address: '科技园创新路88号', constructionUnit: '中建三局', responsiblePerson: '张经理', contactPhone: '13900139003', enclosureStatus: 'DAMAGED', sprinklerStatus: 'NORMAL', rectificationManager: '张三', managerPhone: '13800138001', createdAt: '2026-03-10 14:00:00' },
  { id: 4, name: '地铁5号线施工现场', address: '地铁5号线各站点', constructionUnit: '中铁建设集团', responsiblePerson: '陈经理', contactPhone: '13900139004', enclosureStatus: 'UNDER_REPAIR', sprinklerStatus: 'OFFLINE', rectificationManager: '孙六', managerPhone: '13800138004', createdAt: '2026-04-05 08:00:00' },
]

const ConstructionSites = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length })
  const [enclosureStatus, setEnclosureStatus] = useState()
  const [sprinklerStatus, setSprinklerStatus] = useState()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, size: pagination.pageSize }
      if (enclosureStatus) params.enclosureStatus = enclosureStatus
      if (sprinklerStatus) params.sprinklerStatus = sprinklerStatus
      const res = await api.getConstructionSites(params).catch(() => null)
      if (res) {
        setData(res.content || res.data || mockData)
        setPagination((p) => ({ ...p, total: res.totalElements || res.total || mockData.length }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [pagination.current, pagination.pageSize, enclosureStatus, sprinklerStatus])

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
        await api.updateConstructionSite(editingRecord.id, values).catch(() => null)
        message.success('修改成功')
      } else {
        await api.createConstructionSite(values).catch(() => null)
        message.success('创建成功')
      }
      setModalOpen(false)
      fetchData()
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteConstructionSite(id).catch(() => null)
      message.success('删除成功')
      fetchData()
    } catch (e) { console.error(e) }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '工地名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '地址', dataIndex: 'address', key: 'address', width: 240 },
    { title: '施工单位', dataIndex: 'constructionUnit', key: 'constructionUnit', width: 200 },
    { title: '负责人', dataIndex: 'responsiblePerson', key: 'responsiblePerson', width: 100 },
    { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 130 },
    {
      title: '围挡状态',
      dataIndex: 'enclosureStatus',
      key: 'enclosureStatus',
      width: 100,
      render: (v) => {
        const s = enclosureStatusMap[v] || { color: 'default', text: v }
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
    {
      title: '喷淋状态',
      dataIndex: 'sprinklerStatus',
      key: 'sprinklerStatus',
      width: 100,
      render: (v) => {
        const s = sprinklerStatusMap[v] || { color: 'default', text: v }
        return <Tag color={s.color}>{s.text}</Tag>
      },
    },
    { title: '整改负责人', dataIndex: 'rectificationManager', key: 'rectificationManager', width: 120 },
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
        <h2>工地信息管理</h2>
      </div>

      <div className="action-bar">
        <div />
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新加工地</Button>
      </div>

      <div className="filter-bar">
        <Row gutter={[16, 16]}>
          <Col>
            <Select placeholder="围挡状态" allowClear style={{ width: 160 }} value={enclosureStatus} onChange={setEnclosureStatus}
              options={Object.keys(enclosureStatusMap).map((k) => ({ value: k, label: enclosureStatusMap[k].text }))}
            />
          </Col>
          <Col>
            <Select placeholder="喷淋状态" allowClear style={{ width: 160 }} value={sprinklerStatus} onChange={setSprinklerStatus}
              options={Object.keys(sprinklerStatusMap).map((k) => ({ value: k, label: sprinklerStatusMap[k].text }))}
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

      <Modal title={editingRecord ? '编辑工地' : '新加工地'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)} width={720}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="工地名称" rules={[{ required: true }]}>
                <Input placeholder="请输入工地名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="constructionUnit" label="施工单位" rules={[{ required: true }]}>
                <Input placeholder="请输入施工单位" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="address" label="工地地址" rules={[{ required: true }]}>
            <Input placeholder="请输入工地地址" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="responsiblePerson" label="负责人" rules={[{ required: true }]}>
                <Input placeholder="负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactPhone" label="联系电话" rules={[{ required: true }]}>
                <Input placeholder="联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="enclosureStatus" label="围挡状态" rules={[{ required: true }]}>
                <Select options={Object.keys(enclosureStatusMap).map((k) => ({ value: k, label: enclosureStatusMap[k].text }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sprinklerStatus" label="喷淋设备状态" rules={[{ required: true }]}>
                <Select options={Object.keys(sprinklerStatusMap).map((k) => ({ value: k, label: sprinklerStatusMap[k].text }))} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="rectificationManager" label="整改负责人">
                <Input placeholder="整改负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="managerPhone" label="整改负责人电话">
                <Input placeholder="整改负责人电话" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Spin>
  )
}

export default ConstructionSites
