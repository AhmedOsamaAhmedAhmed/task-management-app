/**
 * Local storage utility functions
 */

import { STORAGE_KEYS } from '../constants/storage.constants';
import { User } from '../types';

export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

export const authStorage = {
  getToken: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken: (token: string): void => {
    storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  removeToken: (): void => {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  },

  getUser: <T = User>(): T | null => {
    return storage.get<T>(STORAGE_KEYS.USER);
  },

  setUser: <T = User>(user: T): void => {
    storage.set(STORAGE_KEYS.USER, user);
  },

  removeUser: (): void => {
    storage.remove(STORAGE_KEYS.USER);
  },

  clearAuth: (): void => {
    authStorage.removeToken();
    authStorage.removeUser();
  },
};

export const uiStorage = {
  getTheme: (): 'light' | 'dark' => {
    return storage.get<'light' | 'dark'>(STORAGE_KEYS.THEME, 'light') || 'light';
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    storage.set(STORAGE_KEYS.THEME, theme);
  },

  getSidebarCollapsed: (): boolean => {
    return storage.get<boolean>(STORAGE_KEYS.SIDEBAR_COLLAPSED, false) || false;
  },

  setSidebarCollapsed: (collapsed: boolean): void => {
    storage.set(STORAGE_KEYS.SIDEBAR_COLLAPSED, collapsed);
  },

  getLanguage: (): string => {
    return storage.get<string>(STORAGE_KEYS.LANGUAGE, 'en') || 'en';
  },

  setLanguage: (language: string): void => {
    storage.set(STORAGE_KEYS.LANGUAGE, language);
  },
};