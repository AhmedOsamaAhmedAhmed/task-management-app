/* eslint-disable prettier/prettier */
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