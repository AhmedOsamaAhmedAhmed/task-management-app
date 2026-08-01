/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Axios configuration with interceptors
 */

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

import { authStorage } from '../utils/localStorage';
import { env } from '../config/env.config';
import { handleApiError } from '../utils/errorHandler';

const API_BASE_URL = env.apiUrl;

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = authStorage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle token refresh logic (if needed)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Token expired or invalid
      // We could implement refresh token logic here
      authStorage.clearAuth();

      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Handle other errors
    const errorMessage = handleApiError(error);

    // Custom error object for consistent handling
    const customError = new Error(errorMessage);
    (customError as any).statusCode = error.response?.status;
    (customError as any).originalError = error;

    return Promise.reject(customError);
  }
);

// Helper for file uploads
export const apiWithMultipart = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  },
});

// Add same interceptors to multipart client
apiWithMultipart.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = authStorage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiWithMultipart.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      authStorage.clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);