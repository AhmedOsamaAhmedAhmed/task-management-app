/**
 * Environment configuration
 */

const getEnvVar = (key: keyof ImportMetaEnv, defaultValue?: string): string => {
  const value = import.meta.env[key] as string | undefined;
  if (!value) {
    console.warn(`⚠️ Environment variable ${key} is not set`);
    return defaultValue || '';
  }
  return value;
};

export const env = {
  // API Configuration
  apiUrl: getEnvVar('VITE_API_URL', 'http://localhost:3000/api'),
  wsUrl: getEnvVar('VITE_WS_URL', 'ws://localhost:3000/tasks'),

  // App Configuration
  appName: getEnvVar('VITE_APP_NAME', 'Task Management System'),
  appVersion: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  env: getEnvVar('VITE_ENV', 'development'),

  // Features
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test',
} as const;

export type Env = typeof env;