/**
 * Error boundary component to catch React errors
 */

import { Button, Result } from 'antd';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="error-boundary" style={{ padding: '2rem' }}>
          <Result
            status="error"
            title="Something went wrong"
            subTitle={
              error?.message || 'An unexpected error occurred. Please try again.'
            }
            extra={[
              <Button type="primary" key="retry" onClick={this.handleReset}>
                Retry
              </Button>,
              <Button key="home" onClick={() => (window.location.href = '/')}>
                Go to Home
              </Button>,
            ]}
          />
          {process.env.NODE_ENV === 'development' && error && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f0f0f0',
                borderRadius: '8px',
                overflow: 'auto',
                maxHeight: '300px',
              }}
            >
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                {error.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return children;
  }
}

// Helper component for lazy loading fallback
export function ErrorBoundaryFallback() {
  return (
    <div className="error-boundary-fallback" style={{ padding: '2rem', textAlign: 'center' }}>
      <Result
        status="warning"
        title="Failed to load content"
        subTitle="Please try refreshing the page"
        extra={
          <Button type="primary" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        }
      />
    </div>
  );
}