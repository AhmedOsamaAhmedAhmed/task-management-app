/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Forgot password page
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../schemas/auth.schema';

const { Title, Text } = Typography;

export function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    try {
      // API call would go here
      console.log('Forgot password:', data);
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email. Please try again.');
    }
  };

  if (submitted) {
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
        <Card style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
          <Title level={3}>Check your email</Title>
          <Text type="secondary">
            We've sent a password reset link to your email address.
          </Text>
          <div style={{ marginTop: 24 }}>
            <Link to="/login">
              <Button type="primary">Back to Login</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

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
      <Card style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            TaskBoard
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Reset your password
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

        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Form.Item
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Input
              size="large"
              placeholder="Email"
              {...register('email')}
              disabled={isSubmitting}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Send Reset Link
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/login">Back to Login</Link>
        </div>
      </Card>
    </div>
  );
}