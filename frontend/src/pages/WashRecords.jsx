import React, { useEffect, useState } from 'react'
import { Table, Tag, Select, Button, Row, Col, Modal, Form, Input, Space, message, Spin, Image } from 'antd'
import { ThunderboltOutlined, CheckCircleOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { api } from '../api'

const statusMap = {
  UNWASHED: { color: 'red', text: '未冲洗' },
  WASHED: { color: 'green', text: '已冲洗' },
}

const mockData = [
  { id: 1, siteId: 1, siteName: '中央公园A区工地', plateNumber: '京A12345', washStart: '2026-06-06 08:15:00', washEnd: '2026-06-06 08:18:30', washDuration: 210, status: 'WASHED', operator: '王师傅', beforeImageUrl: 'https://placehold.co/400x300?text=Before+1', afterImageUrl: 'https://placehold.co/400x300?text=After+1', createdAt: '2026-06-06 08:15:00' },
  { id: 2, siteId: 2, siteName: '滨江大道改造工程', plateNumber: '京B67890', washStart: '2026-06-06 09:20:00', washEnd: null, washDuration: 0, status: 'UNWASHED', operator: null, beforeImageUrl: 'https://placehold.co/400x300?text=Before+2', afterImageUrl: null, createdAt: '2026-06-06 09:20:00' },
  { id: 3, siteId: 3, siteName: '科技园B区一期', plateNumber: '京C11111', washStart: '2026-06-06 10:05:00', washEnd: '2026-06-06 10:08:20', washDuration: 200, status: 'WASHED', operator: '李师傅', beforeImageUrl: 'https://placehold.co/400x300?text=Before+3', afterImageUrl: 'https://placehold.co/400x300?text=After+3', createdAt: '2026-06-06 10:05:00' },
]

const WashRecords = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length })
  const [status, setStatus] = useState()
  const [siteId, setSiteId] = useState()
  const [plateNumber, setPlateNumber] = useState()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [createForm] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.getWashRecords().catch(() => null)
      if (res && res.code === 200 && res.data) {
        let list = res.data
        if (status) list = list.filter((x) => x.status === status)
        if (siteId) list = list.filter((x) => x.siteId === siteId)
        if (plateNumber) list = list.filter((x) => x.plateNumber?.includes(plateNumber))
        setData(list)
        setPagination((p) => ({ ...p, total: list.length }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [pagination.current, pagination.pageSize, status, siteId, plateNumber])

  const handleConfirm = async (record) => {
    try {
      const res = await api.confirmWash(record.id)
      if (res && res.code === 200) {
        message.success('冲洗确认成功')
        fetchData()
      } else {
        message.error(res?.message || '确认失败')
      }
    } catch (e) {
      console.error(e)
      message.error(e?.response?.data?.message || e.message || '确认失败')
    }
  }

  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields()
      const res = await api.createWashRecord(values)
      if (res && res.code === 200) {
        message.success('冲洗记录创建成功')
        setCreateModalOpen(false)
        createForm.resetFields()
        fetchData()
      } else {
        message.error(res?.message || '创建失败')
      }
    } catch (e) {
      console.error(e)
      message.error(e?.response?.data?.message || e.message || '创建失败')
    }
  }

  const openDetail = (record) => {
    setSelectedRecord(record)
    setDetailModalOpen(true)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '所属工地', dataIndex: 'siteName', key: 'siteName', width: 180, render: (_, r) => r.siteName || `工地#${r.siteId}` },
    { title: '车牌号', dataIndex: 'plateNumber', key: 'plateNumber', width: 130 },
    {
      title: '冲洗时长',
      dataIndex: 'washDuration',
      key: 'washDuration',
      width: 110,
      render: (v) => v ? `${v}秒` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v) => {
        const s = statusMap[v] || { color: 'default', text: v }
        return <Tag color={s.color} icon={v === 'WASHED' ? <CheckCircleOutlined /> : <ThunderboltOutlined />}>{s.text}</Tag>
      },
    },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100, render: (v) => v || '-' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} onClick={() => openDetail(record)}>详情</Button>
          {record.status === 'UNWASHED' && (
            <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleConfirm(record)}>冲洗确认</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <Spin spinning={loading}>
      <div className="page-header">
        <h2>冲洗记录管理</h2>
      </div>

      <div className="action-bar">
        <div />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>新增冲洗记录</Button>
      </div>

      <div className="filter-bar">
        <Row gutter={[16, 16]}>
          <Col>
            <Input.Search placeholder="车牌号" allowClear style={{ width: 200 }} value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} onSearch={(v) => setPlateNumber(v)} />
          </Col>
          <Col>
            <Select placeholder="所属工地" allowClear style={{ width: 200 }} value={siteId} onChange={setSiteId}
              options={[
                { value: 1, label: '中央公园A区工地' },
                { value: 2, label: '滨江大道改造工程' },
                { value: 3, label: '科技园B区一期' },
                { value: 4, label: '地铁5号线施工现场' },
              ]}
            />
          </Col>
          <Col>
            <Select placeholder="冲洗状态" allowClear style={{ width: 160 }} value={status} onChange={setStatus}
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

      <Modal title="新增冲洗记录" open={createModalOpen} onOk={handleCreate} onCancel={() => setCreateModalOpen(false)} width={640}>
        <Form form={createForm} layout="vertical">
          <Row gutter={16}>
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
            <Col span={12}>
              <Form.Item name="plateNumber" label="车牌号" rules={[{ required: true }]}>
                <Input placeholder="例如：京A12345" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="washStart" label="开始时间">
                <Input placeholder="例如：2026-06-06 08:15:00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="washEnd" label="结束时间">
                <Input placeholder="例如：2026-06-06 08:18:30" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="operator" label="操作人">
            <Input placeholder="操作人姓名" />
          </Form.Item>
          <Form.Item name="beforeImageUrl" label="冲洗前照片URL">
            <Input placeholder="可选" />
          </Form.Item>
          <Form.Item name="afterImageUrl" label="冲洗后照片URL">
            <Input placeholder="可选" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="冲洗记录详情" open={detailModalOpen} onCancel={() => setDetailModalOpen(false)} footer={null} width={640}>
        {selectedRecord && (
          <div>
            <p><b>所属工地：</b>{selectedRecord.siteName || `工地#${selectedRecord.siteId}`}</p>
            <p><b>车牌号：</b>{selectedRecord.plateNumber}</p>
            <p><b>状态：</b>
              <Tag color={statusMap[selectedRecord.status]?.color}>
                {statusMap[selectedRecord.status]?.text}
              </Tag>
            </p>
            <p><b>开始时间：</b>{selectedRecord.washStart || '-'}</p>
            <p><b>结束时间：</b>{selectedRecord.washEnd || '-'}</p>
            <p><b>冲洗时长：</b>{selectedRecord.washDuration ? `${selectedRecord.washDuration}秒` : '-'}</p>
            <p><b>操作人：</b>{selectedRecord.operator || '-'}</p>
            <p><b>创建时间：</b>{selectedRecord.createdAt}</p>
            <div style={{ marginTop: 12 }}>
              {selectedRecord.beforeImageUrl && (
                <div style={{ display: 'inline-block', marginRight: 16 }}>
                  <p><b>冲洗前：</b></p>
                  <Image width={260} src={selectedRecord.beforeImageUrl} />
                </div>
              )}
              {selectedRecord.afterImageUrl && (
                <div style={{ display: 'inline-block' }}>
                  <p><b>冲洗后：</b></p>
                  <Image width={260} src={selectedRecord.afterImageUrl} />
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </Spin>
  )
}

export default WashRecords
