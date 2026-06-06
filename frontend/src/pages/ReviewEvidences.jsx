import React, { useEffect, useState } from 'react'
import { Table, Tag, Select, Image, Row, Col, Modal, Button, Spin } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { api } from '../api'

const evidenceTypeMap = {
  BEFORE: '整改前',
  AFTER: '整改后',
  PROCESS: '整改过程',
  DOCUMENT: '证明文件',
}

const mockData = [
  { id: 1, taskId: 3, taskTitle: '施工围挡破损', siteName: '中央公园A区工地', evidenceType: 'BEFORE', description: '南侧围挡破损约5米', imageUrl: 'https://placehold.co/600x400?text=Before+1', submitter: '赵五', submittedAt: '2026-06-05 16:30:00' },
  { id: 2, taskId: 3, taskTitle: '施工围挡破损', siteName: '中央公园A区工地', evidenceType: 'PROCESS', description: '工人正在修复围挡', imageUrl: 'https://placehold.co/600x400?text=Process+1', submitter: '赵五', submittedAt: '2026-06-06 09:15:00' },
  { id: 3, taskId: 3, taskTitle: '施工围挡破损', siteName: '中央公园A区工地', evidenceType: 'AFTER', description: '围挡修复完成，恢复原状', imageUrl: 'https://placehold.co/600x400?text=After+1', submitter: '赵五', submittedAt: '2026-06-06 14:20:00' },
  { id: 4, taskId: 4, taskTitle: '喷淋设备故障', siteName: '地铁5号线施工现场', evidenceType: 'BEFORE', description: '东区3号喷淋设备损坏', imageUrl: 'https://placehold.co/600x400?text=Before+2', submitter: '孙六', submittedAt: '2026-06-04 10:30:00' },
  { id: 5, taskId: 4, taskTitle: '喷淋设备故障', siteName: '地铁5号线施工现场', evidenceType: 'AFTER', description: '设备已更换，喷淋恢复正常', imageUrl: 'https://placehold.co/600x400?text=After+2', submitter: '孙六', submittedAt: '2026-06-04 16:45:00' },
  { id: 6, taskId: 2, taskTitle: '出场车辆未冲洗', siteName: '滨江大道改造工程', evidenceType: 'BEFORE', description: '抓拍照片：京B67890未冲洗出场', imageUrl: 'https://placehold.co/600x400?text=Before+3', submitter: '李四', submittedAt: '2026-06-06 09:20:00' },
]

const ReviewEvidences = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(mockData)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length })
  const [taskId, setTaskId] = useState()
  const [siteId, setSiteId] = useState()
  const [evidenceType, setEvidenceType] = useState()
  const [previewImage, setPreviewImage] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = { page: pagination.current, size: pagination.pageSize }
      if (taskId) params.taskId = taskId
      if (siteId) params.siteId = siteId
      if (evidenceType) params.evidenceType = evidenceType
      const res = await api.getReviewEvidences(params).catch(() => null)
      if (res) {
        setData(res.content || res.data || mockData)
        setPagination((p) => ({ ...p, total: res.totalElements || res.total || mockData.length }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [pagination.current, pagination.pageSize, taskId, siteId, evidenceType])

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '关联任务', dataIndex: 'taskTitle', key: 'taskTitle', width: 180 },
    { title: '所属工地', dataIndex: 'siteName', key: 'siteName', width: 180 },
    {
      title: '证据类型',
      dataIndex: 'evidenceType',
      key: 'evidenceType',
      width: 100,
      render: (v) => {
        const colorMap = { BEFORE: 'red', PROCESS: 'orange', AFTER: 'green', DOCUMENT: 'blue' }
        return <Tag color={colorMap[v] || 'default'}>{evidenceTypeMap[v] || v}</Tag>
      },
    },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '提交人', dataIndex: 'submitter', key: 'submitter', width: 100 },
    { title: '提交时间', dataIndex: 'submittedAt', key: 'submittedAt', width: 170 },
    {
      title: '证据图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 160,
      render: (v) => v && (
        <Image
          width={120}
          height={80}
          src={v}
          style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
          onClick={() => setPreviewImage(v)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => setPreviewImage(record.imageUrl)}>查看</Button>
      ),
    },
  ]

  return (
    <Spin spinning={loading}>
      <div className="page-header">
        <h2>复查证据库</h2>
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
            <Select placeholder="关联任务" allowClear style={{ width: 220 }} value={taskId} onChange={setTaskId}
              options={[
                { value: 1, label: 'PM2.5严重超标' },
                { value: 2, label: '出场车辆未冲洗' },
                { value: 3, label: '施工围挡破损' },
                { value: 4, label: '喷淋设备故障' },
                { value: 5, label: '夜间施工噪声' },
              ]}
            />
          </Col>
          <Col>
            <Select placeholder="证据类型" allowClear style={{ width: 160 }} value={evidenceType} onChange={setEvidenceType}
              options={Object.keys(evidenceTypeMap).map((k) => ({ value: k, label: evidenceTypeMap[k] }))}
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

      <Modal open={!!previewImage} onCancel={() => setPreviewImage(null)} footer={null} title="证据图片" width={720}>
        {previewImage && <Image src={previewImage} style={{ width: '100%' }} preview={false} />}
      </Modal>
    </Spin>
  )
}

export default ReviewEvidences
