/**
 * Private route component to protect authenticated routes
 */

import { Navigate, useLocation } from 'react-router-dom';

import { FullPageLoader } from './LoadingSpinner';
import { ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'member';
  redirectTo?: string;
}

export function PrivateRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: PrivateRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  // Show loading while checking authentication
  if (isLoading) {
    return <FullPageLoader />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Admin only route
export function AdminRoute({ children }: { children: ReactNode }) {
  return <PrivateRoute requiredRole="admin">{children}</PrivateRoute>;
}

// Member only route
export function MemberRoute({ children }: { children: ReactNode }) {
  return <PrivateRoute requiredRole="member">{children}</PrivateRoute>;
}