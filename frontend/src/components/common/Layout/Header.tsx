/**
 * Header component with logo, user menu, and logout
 */

import { Button, Dropdown, Layout, Space } from 'antd';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from '../../users/UserAvatar';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Header({ collapsed, onToggle }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { showNotification } = useUIStore();

  const handleLogout = () => {
    logout();
    showNotification('info', 'Logged out successfully');
  };

  const menuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{ fontSize: '16px', width: 48, height: 48 }}
        />
        <div
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1890ff',
            marginLeft: '8px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard')}
        >
          TaskBoard
        </div>
      </div>

      <Space>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <UserAvatar user={user} size={32} />
            <span style={{ marginLeft: '8px', fontWeight: '500' }}>
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}