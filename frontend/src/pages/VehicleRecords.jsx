import React, { useEffect, useState } from 'react'
import { Table, Tag, Select, DatePicker, Input, Button, Row, Col, Image, Modal, Spin } from 'antd'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { api } from '../api'

const { RangePicker } = DatePicker

const mockData = [
  { id: 1, plateNumber: '京A12345', siteName: '中央公园A区工地', recordType: 'IN', recordTime: '2026-06-06 08:30:15', captureImageUrl: 'https://placehold.co/400x240?text=Vehicle+1', washStatus: 'WASHED', isNightViolation: false, remark: '正常' },
  { id: 2, plateNumber: '京B67890', siteName: '滨江大道改造工程', recordType: 'OUT', recordTime: '2026-06-06 09:15:42', captureImageUrl: 'https://placehold.co/400x240?text=Vehicle+2', washStatus: 'UNWASHED', isNightViolation: false, remark: '未冲洗，需整改' },
  { id: 3, plateNumber: '京C11111', siteName: '科技园B区一期', recordType: 'OUT', recordTime: '2026-06-06 22:45:30', captureImageUrl: 'https://placehold.co/400x240?text=Vehicle+3', washStatus: 'WASHED', isNightViolation: true, remark: '夜间违规运输' },
  { id: 4, plateNumber: '京D22222', siteName: '地铁5号线施工现场', recordType: 'IN', recordTime: '2026-06-06 07:20:10', captureImageUrl: 'https://placehold.co/400x240?text=Vehicle+4', washStatus: 'NOT_REQUIRED', isNightViolation: false, remark: '-' },
  { id: 5, plateNumber: '京E33333', siteName: '中央公园A区工地', recordType: 'OUT', recordTime: '2026-06-06 10:50:25', captureImageUrl: 'https://placehold.co/400x240?text=Vehicle+5', washStatus: 'WASHED', isNightViolation: false, remark: '正常' },
  { id: 6, plateNumber: '京F44444', siteName: '科技园B区一期', recordType: 'IN', recordTime: '2026-06-06 06:30:00', captureImageUrl: 'https://placehold.co/400x240?text=Vehicle+6', washStatus: 'WASHED', isNightViolation: false, remark: '-' },
  { id: 7, plateNumber: '京G55555', siteName: '滨江大道改造工程', recordType: 'OUT', recordTime: '2026-06-05 23:15:45', captureImageUrl: 'https://placehold.co/400x240?text=Vehicle+7', washStatus: 'UNWASHED', isNightViolation: true, remark: '夜间未冲洗' },
  { id: 8, plateNumber: '京H66666', siteName: '地铁5号线施工现场', recordType: 'IN', recordTime: '2026-06-05 15:20:33', captureImageUrl: 'https://placehold.co/400x240?text=Vehicle+8', washStatus: 'WASHED', isNightViolation: false, remark: '正常' },
]

const VehicleRecords = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length })
  const [plateNumber, setPlateNumber] = useState()
  const [siteId, setSiteId] = useState()
  const [recordType, setRecordType] = useState()
  const [washStatus, setWashStatus] = useState()
  const [dateRange, setDateRange] = useState()
  const [previewImage, setPreviewImage] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, size: pagination.pageSize }
      if (plateNumber) params.plateNumber = plateNumber
      if (siteId) params.siteId = siteId
      if (recordType) params.recordType = recordType
      if (washStatus) params.washStatus = washStatus
      if (dateRange) {
        params.startTime = dateRange[0]?.format('YYYY-MM-DD')
        params.endTime = dateRange[1]?.format('YYYY-MM-DD')
      }
      const res = await api.getVehicleRecords(params).catch(() => null)
      if (res) {
        setData(res.content || res.data || [])
        setPagination((p) => ({ ...p, total: res.totalElements || res.total || 8 }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [pagination.current, pagination.pageSize])

  const handleSearch = () => {
    setPagination((p) => ({ ...p, current: 1 }))
    fetchData()
  }

  const handleReset = () => {
    setPlateNumber()
    setSiteId()
    setRecordType()
    setWashStatus()
    setDateRange()
    setPagination((p) => ({ ...p, current: 1 }))
    fetchData()
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '车牌号码', dataIndex: 'plateNumber', key: 'plateNumber', width: 120 },
    { title: '所属工地', dataIndex: 'siteName', key: 'siteName', width: 180 },
    {
      title: '出入类型',
      dataIndex: 'recordType',
      key: 'recordType',
      width: 100,
      render: (v) => <Tag color={v === 'IN' ? 'blue' : 'green'}>{v === 'IN' ? '进场' : '出场'}</Tag>,
    },
    { title: '记录时间', dataIndex: 'recordTime', key: 'recordTime', width: 180 },
    {
      title: '冲洗状态',
      dataIndex: 'washStatus',
      key: 'washStatus',
      width: 100,
      render: (v) => {
        const map = { WASHED: { color: 'green', text: '已冲洗' }, UNWASHED: { color: 'red', text: '未冲洗' }, NOT_REQUIRED: { color: 'gray', text: '无需冲洗' } }
        const item = map[v] || { color: 'default', text: v }
        return <Tag color={item.color}>{item.text}</Tag>
      },
    },
    {
      title: '夜间违规',
      dataIndex: 'isNightViolation',
      key: 'isNightViolation',
      width: 100,
      render: (v) => <Tag color={v ? 'red' : 'green'}>{v ? '是' : '否'}</Tag>,
    },
    {
      title: '抓拍图片',
      dataIndex: 'captureImageUrl',
      key: 'captureImageUrl',
      width: 140,
      render: (v) => v && <img src={v} className="capture-image" onClick={() => setPreviewImage(v)} />,
    },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
  ]

  return (
    <Spin spinning={loading}>
      <div className="page-header">
        <h2>车辆出入管理</h2>
      </div>

      <div className="filter-bar">
        <Row gutter={[16, 16]}>
          <Col>
            <Input placeholder="车牌号" prefix={<SearchOutlined />} allowClear value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} style={{ width: 180 }} />
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
            <Select placeholder="出入类型" allowClear style={{ width: 140 }} value={recordType} onChange={setRecordType}
              options={[{ value: 'IN', label: '进场' }, { value: 'OUT', label: '出场' }]}
            />
          </Col>
          <Col>
            <Select placeholder="冲洗状态" allowClear style={{ width: 140 }} value={washStatus} onChange={setWashStatus}
              options={[
                { value: 'WASHED', label: '已冲洗' },
                { value: 'UNWASHED', label: '未冲洗' },
                { value: 'NOT_REQUIRED', label: '无需冲洗' },
              ]}
            />
          </Col>
          <Col>
            <RangePicker value={dateRange} onChange={setDateRange} />
          </Col>
          <Col>
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset}>重置</Button>
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

      <Modal open={!!previewImage} onCancel={() => setPreviewImage(null)} footer={null} title="车辆抓拍">
        {previewImage && <Image src={previewImage} style={{ width: '100%' }} preview={false} />}
      </Modal>
    </Spin>
  )
}

export default VehicleRecords
