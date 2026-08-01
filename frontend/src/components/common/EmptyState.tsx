/**
 * Empty state component for no data states
 */

import { Button, Empty } from 'antd';

import { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  image?: string;
  className?: string;
}

export function EmptyState({
  title = 'No data found',
  description = 'There is no data available at the moment.',
  icon,
  actionLabel,
  onAction,
  image,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`empty-state ${className}`} style={{ padding: '2rem' }}>
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            {icon && <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{icon}</div>}
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem' }}>{title}</h3>
            <p style={{ color: '#666', margin: '0.5rem 0' }}>{description}</p>
          </div>
        }
      >
        {actionLabel && onAction && (
          <Button type="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Empty>
    </div>
  );
}

export function ProjectEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      title="No projects yet"
      description="Create your first project to get started"
      icon="📁"
      actionLabel="Create Project"
      onAction={onAction}
    />
  );
}

export function TaskEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      title="No tasks yet"
      description="Create your first task in this project"
      icon="📋"
      actionLabel="Create Task"
      onAction={onAction}
    />
  );
}

export function MemberEmptyState() {
  return (
    <EmptyState
      title="No members added"
      description="Add team members to collaborate on this project"
      icon="👥"
    />
  );
}