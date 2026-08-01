/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API response types
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  timestamp: string;
  path?: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  timestamp: string;
  path?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  links?: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: any;
}