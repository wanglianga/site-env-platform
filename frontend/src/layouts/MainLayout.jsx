import React, { useState } from 'react'
import { Layout, Menu, theme } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  CloudOutlined,
  CarOutlined,
  TruckOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  FileImageOutlined,
  ExclamationOutlined,
  MessageOutlined,
  ApartmentOutlined,
  ScheduleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/dust-monitoring', icon: <CloudOutlined />, label: '工地监测' },
  { key: '/vehicle-records', icon: <CarOutlined />, label: '车辆出入' },
  { key: '/vehicles', icon: <TruckOutlined />, label: '渣土车管理' },
  { key: '/wash-records', icon: <ThunderboltOutlined />, label: '冲洗记录' },
  { key: '/night-excavation-approvals', icon: <SafetyCertificateOutlined />, label: '夜间出土审批' },
  { key: '/rectification-tasks', icon: <ExclamationCircleOutlined />, label: '整改任务' },
  { key: '/review-evidences', icon: <FileImageOutlined />, label: '复查证据' },
  { key: '/penalties', icon: <ExclamationOutlined />, label: '处罚管理' },
  { key: '/complaints', icon: <MessageOutlined />, label: '投诉处理' },
  { key: '/construction-sites', icon: <ApartmentOutlined />, label: '工地信息' },
  { key: '/earthwork-plans', icon: <ScheduleOutlined />, label: '土方计划' },
]

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="app-logo">{collapsed ? '环保' : '工地环保平台'}</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <h2 style={{ padding: '0 24px', margin: 0, lineHeight: '64px' }}>
            工地环保平台管理系统
          </h2>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 'calc(100vh - 112px)',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
