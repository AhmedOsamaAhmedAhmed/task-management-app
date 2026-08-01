/**
 * User avatar with initials fallback
 */

import { Avatar, Tooltip } from 'antd';

import { User } from '../../types';
import { UserOutlined } from '@ant-design/icons';

interface UserAvatarProps {
  user?: User | null;
  size?: number | 'small' | 'default' | 'large';
  showTooltip?: boolean;
  className?: string;
}

export function UserAvatar({
  user,
  size = 'default',
  showTooltip = true,
  className = '',
}: UserAvatarProps) {
  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getAvatarColor = (name: string): string => {
    const colors = [
      '#1890ff', '#52c41a', '#faad14', '#f5222d',
      '#722ed1', '#13c2c2', '#eb2f96', '#fa541c',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (!user) {
    return (
      <Avatar
        size={size}
        icon={<UserOutlined />}
        className={className}
      />
    );
  }

  const name = `${user.firstName} ${user.lastName}`;
  const initials = getInitials(user.firstName, user.lastName);
  const color = getAvatarColor(name);

  const avatar = (
    <Avatar
      size={size}
      style={{ backgroundColor: color }}
      className={className}
    >
      {initials || <UserOutlined />}
    </Avatar>
  );

  if (showTooltip) {
    return (
      <Tooltip title={`${name} (${user.role})`}>
        {avatar}
      </Tooltip>
    );
  }

  return avatar;
}