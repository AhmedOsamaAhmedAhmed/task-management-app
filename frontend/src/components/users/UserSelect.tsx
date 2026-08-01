/**
 * Searchable user select dropdown
 */

import { Empty, Select, Spin } from 'antd';
import { useMemo, useState } from 'react';

import { User } from '../../types';
import { UserAvatar } from './UserAvatar';
import { useDebounce } from '../../hooks/useDebounce';
import { useUsers } from '../../hooks/useUsers';

const { Option } = Select;

interface UserSelectProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  excludeUserIds?: string[];
  filter?: (user: User) => boolean;
  size?: 'large' | 'middle' | 'small';
  allowClear?: boolean;
  className?: string;
}

export function UserSelect({
  value,
  onChange,
  placeholder = 'Select a user',
  disabled = false,
  loading = false,
  excludeUserIds = [],
  filter,
  size = 'middle',
  allowClear = true,
  className = '',
}: UserSelectProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useUsers({
    search: debouncedSearch || undefined,
    limit: 20,
  });

  const users = useMemo(() => {
    let filteredUsers = data?.data || [];

    // Exclude specific users
    if (excludeUserIds.length > 0) {
      filteredUsers = filteredUsers.filter((u) => !excludeUserIds.includes(u.id));
    }

    // Apply custom filter
    if (filter) {
      filteredUsers = filteredUsers.filter(filter);
    }

    return filteredUsers;
  }, [data, excludeUserIds, filter]);

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  const handleChange = (selectedValue: string | null) => {
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      loading={loading || isLoading}
      size={size}
      allowClear={allowClear}
      className={className}
      showSearch
      onSearch={handleSearch}
      filterOption={false}
      notFoundContent={
        isLoading ? (
          <div style={{ textAlign: 'center', padding: '8px' }}>
            <Spin size="small" />
          </div>
        ) : (
          <Empty description="No users found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )
      }
      optionLabelProp="label"
    >
      {users.map((user) => (
        <Option
          key={user.id}
          value={user.id}
          label={`${user.firstName} ${user.lastName}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserAvatar user={user} size="small" showTooltip={false} />
            <span>
              {user.firstName} {user.lastName}
              <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px' }}>
                ({user.role})
              </span>
            </span>
          </div>
        </Option>
      ))}
    </Select>
  );
}