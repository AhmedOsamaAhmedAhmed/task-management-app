/* eslint-disable @typescript-eslint/no-explicit-any */
 
/**
 * Error handling utility functions
 */

import { AxiosError } from 'axios';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const isApiError = (error: unknown): error is { success: false; message: string } => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'success' in error &&
    (error as any).success === false
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

export const getErrorStatusCode = (error: unknown): number => {
  if (error instanceof AppError) {
    return error.statusCode;
  }

  if (error instanceof AxiosError) {
    return error.response?.status || 500;
  }

  return 500;
};

// ✅ إصلاح: استخدام any بدلاً من النوع المحدد
export const handleApiError = (error: AxiosError<any>): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.status === 401) {
    return 'Session expired. Please login again.';
  }

  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error.response?.status === 404) {
    return 'Resource not found.';
  }

  if (error.response?.status === 409) {
    return 'Resource already exists.';
  }

  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Please check your connection.';
  }

  if (error.request) {
    return 'Network error. Please check your connection.';
  }

  return 'An unexpected error occurred. Please try again.';
};

export const formatValidationErrors = (errors: string[]): string => {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  return errors.join('\n');
};