/**
 * Loading spinner component with full page and inline variants
 */

import './LoadingSpinner.css';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  size?: 'small' | 'default' | 'large';
  tip?: string;
  className?: string;
}

export function LoadingSpinner({
  fullPage = false,
  size = 'large',
  tip,
  className = '',
}: LoadingSpinnerProps) {
  const spinner = (
    <Spin
      indicator={<LoadingOutlined spin />}
      size={size}
      tip={tip}
      className={className}
    />
  );

  if (fullPage) {
    return (
      <div className="loading-spinner-fullpage" role="status" aria-label="Loading">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function FullPageLoader() {
  return (
    <div
      className="loading-spinner-fullpage"
      role="status"
      aria-label="Loading application"
    >
      <Spin
        indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />}
        tip="Loading..."
        size="large"
      />
    </div>
  );
}

export function InlineLoader({ tip = 'Loading...' }: { tip?: string }) {
  return (
    <div className="inline-loader" role="status" aria-label={tip}>
      <Spin indicator={<LoadingOutlined spin />} tip={tip} />
    </div>
  );
}