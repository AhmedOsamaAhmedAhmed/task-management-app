/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Login page with form validation and authentication
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Input, Button, Card, Typography, Checkbox, Alert, Space } from 'antd';
import { loginSchema, LoginFormData } from '../../schemas/auth.schema';
import { useAuth } from '../../hooks/useAuth';
// import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const { Title, Text } = Typography;

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            TaskBoard
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Sign in to your account
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: 16 }}
            onClose={() => setError(null)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Item
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Input
              size="large"
              placeholder="Email"
              {...register('email')}
              disabled={isLoggingIn}
            />
          </Form.Item>

          <Form.Item
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Input.Password
              size="large"
              placeholder="Password"
              {...register('password')}
              disabled={isLoggingIn}
            />
          </Form.Item>

          <Form.Item>
            <Checkbox {...register('rememberMe')} disabled={isLoggingIn}>
              Remember me
            </Checkbox>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoggingIn}
            disabled={isLoggingIn}
          >
            Sign In
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Space direction="vertical" size={4}>
            <Text type="secondary">
              Don't have an account? <Link to="/register">Sign up</Link>
            </Text>
            <Link to="/forgot-password" style={{ fontSize: 14 }}>
              Forgot password?
            </Link>
          </Space>
        </div>

        {/* Test Credentials Info */}
        <div
          style={{
            marginTop: 24,
            padding: 12,
            background: '#f7f9fc',
            borderRadius: 6,
            fontSize: 13,
            color: '#666',
          }}
        >
          <Text strong style={{ fontSize: 13 }}>
            Test Credentials:
          </Text>
          <br />
          <Text type="secondary">Admin: admin@example.com / admin123</Text>
          <br />
          <Text type="secondary">Member: user@example.com / user123</Text>
        </div>
      </Card>
    </div>
  );
}