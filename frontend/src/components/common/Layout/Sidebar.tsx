/**
 * Sidebar navigation component
 */

import {
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ProjectOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  // ✅ القائمة الرئيسية
  const mainMenuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: 'Projects',
      onClick: () => navigate('/projects'),
    },
    {
      key: '/tasks',
      icon: <FileTextOutlined />,
      label: 'Tasks',
      onClick: () => navigate('/tasks'),
    },
  ];

  // ✅ قائمة Admin
  const adminMenuItems = isAdmin
    ? [
        {
          key: '/users',
          icon: <TeamOutlined />,
          label: 'Users',
          onClick: () => navigate('/users'),
        },
      ]
    : [];

  // ✅ قائمة الإعدادات
  const settingsMenuItems = [
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  // ✅ دمج جميع القوائم مع فواصل
  const menuItems = [
    ...mainMenuItems,
    ...adminMenuItems,
    { type: 'divider' as const },
    ...settingsMenuItems,
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{
          borderRight: 'none',
          paddingTop: '16px',
        }}
      />
    </Sider>
  );
}