/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Registration page with form validation
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Checkbox,
  Alert,
  Space,
  Progress,
} from 'antd';
import { registerSchema, RegisterFormData } from '../../schemas/auth.schema';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

export function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isRegistering } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      acceptTerms: false,
    },
    mode: 'onChange',
  });

  const password = watch('password');

  // Calculate password strength
  const calculatePasswordStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 25;
    if (/\d/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength <= 25) return '#ff4d4f';
    if (strength <= 50) return '#faad14';
    if (strength <= 75) return '#1890ff';
    return '#52c41a';
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
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
          maxWidth: 460,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            TaskBoard
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Create your account
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
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Form.Item
              label="Email"
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email?.message}
            >
              <Input
                size="large"
                placeholder="Enter your email"
                {...register('email')}
                disabled={isRegistering}
              />
            </Form.Item>

            <Form.Item
              label="First Name"
              validateStatus={errors.firstName ? 'error' : ''}
              help={errors.firstName?.message}
            >
              <Input
                size="large"
                placeholder="Enter your first name"
                {...register('firstName')}
                disabled={isRegistering}
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              validateStatus={errors.lastName ? 'error' : ''}
              help={errors.lastName?.message}
            >
              <Input
                size="large"
                placeholder="Enter your last name"
                {...register('lastName')}
                disabled={isRegistering}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password?.message}
            >
              <Input.Password
                size="large"
                placeholder="Enter your password"
                {...register('password')}
                onChange={(e) => {
                  const strength = calculatePasswordStrength(e.target.value);
                  setPasswordStrength(strength);
                }}
                disabled={isRegistering}
              />
              {password && (
                <div style={{ marginTop: 8 }}>
                  <Progress
                    percent={passwordStrength}
                    strokeColor={getPasswordStrengthColor(passwordStrength)}
                    showInfo={false}
                    size="small"
                  />
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      color: getPasswordStrengthColor(passwordStrength),
                    }}
                  >
                    Password strength: {getPasswordStrengthText(passwordStrength)}
                  </Text>
                </div>
              )}
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              validateStatus={errors.confirmPassword ? 'error' : ''}
              help={errors.confirmPassword?.message}
            >
              <Input.Password
                size="large"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                disabled={isRegistering}
              />
            </Form.Item>

            <Form.Item
              validateStatus={errors.acceptTerms ? 'error' : ''}
              help={errors.acceptTerms?.message}
            >
              <Checkbox {...register('acceptTerms')} disabled={isRegistering}>
                I agree to the{' '}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Terms and Conditions
                </a>
              </Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isRegistering}
              disabled={isRegistering}
            >
              Create Account
            </Button>
          </Space>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">
            Already have an account? <Link to="/login">Sign in</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}