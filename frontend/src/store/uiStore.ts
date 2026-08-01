/**
 * UI store for global UI state
 */

import { createJSONStorage, persist } from 'zustand/middleware';

import { create } from 'zustand';
import { uiStorage } from '../utils/localStorage';

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;

  // Modals
  modals: {
    [key: string]: boolean;
  };

  // Theme
  theme: 'light' | 'dark';

  // Loading
  globalLoading: boolean;
  loadingOverlay: boolean;

  // Notifications
  notification: {
    type: 'success' | 'error' | 'warning' | 'info' | null;
    message: string | null;
    open: boolean;
  };

  // Breadcrumbs
  breadcrumbs: Array<{
    label: string;
    path?: string;
  }>;
}

interface UIStore extends UIState {
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;

  // Modal actions
  openModal: (key: string) => void;
  closeModal: (key: string) => void;
  toggleModal: (key: string) => void;
  isModalOpen: (key: string) => boolean;

  // Theme actions
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  setLoadingOverlay: (loading: boolean) => void;

  // Notification actions
  showNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  hideNotification: () => void;

  // Breadcrumb actions
  setBreadcrumbs: (items: Array<{ label: string; path?: string }>) => void;
  addBreadcrumb: (item: { label: string; path?: string }) => void;
  clearBreadcrumbs: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarCollapsed: false,
      sidebarOpen: false,
      modals: {},
      theme: 'light',
      globalLoading: false,
      loadingOverlay: false,
      notification: {
        type: null,
        message: null,
        open: false,
      },
      breadcrumbs: [],

      // Sidebar actions
      toggleSidebar: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        }));
        uiStorage.setSidebarCollapsed(!get().sidebarCollapsed);
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
        uiStorage.setSidebarCollapsed(collapsed);
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      // Modal actions
      openModal: (key: string) => {
        set((state) => ({
          modals: { ...state.modals, [key]: true },
        }));
      },

      closeModal: (key: string) => {
        set((state) => ({
          modals: { ...state.modals, [key]: false },
        }));
      },

      toggleModal: (key: string) => {
        set((state) => ({
          modals: { ...state.modals, [key]: !state.modals[key] },
        }));
      },

      isModalOpen: (key: string) => {
        return get().modals[key] || false;
      },

      // Theme actions
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          uiStorage.setTheme(newTheme);
          return { theme: newTheme };
        });
      },

      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
        uiStorage.setTheme(theme);
      },

      // Loading actions
      setGlobalLoading: (loading: boolean) => {
        set({ globalLoading: loading });
      },

      setLoadingOverlay: (loading: boolean) => {
        set({ loadingOverlay: loading });
      },

      // Notification actions
      showNotification: (
        type: 'success' | 'error' | 'warning' | 'info',
        message: string
      ) => {
        set({
          notification: {
            type,
            message,
            open: true,
          },
        });

        // Auto hide after 5 seconds
        setTimeout(() => {
          get().hideNotification();
        }, 5000);
      },

      hideNotification: () => {
        set({
          notification: {
            type: null,
            message: null,
            open: false,
          },
        });
      },

      // Breadcrumb actions
      setBreadcrumbs: (items: Array<{ label: string; path?: string }>) => {
        set({ breadcrumbs: items });
      },

      addBreadcrumb: (item: { label: string; path?: string }) => {
        set((state) => ({
          breadcrumbs: [...state.breadcrumbs, item],
        }));
      },

      clearBreadcrumbs: () => {
        set({ breadcrumbs: [] });
      },
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Selectors
export const useSidebarCollapsed = () => useUIStore((state) => state.sidebarCollapsed);
export const useTheme = () => useUIStore((state) => state.theme);
export const useGlobalLoading = () => useUIStore((state) => state.globalLoading);
export const useNotification = () => useUIStore((state) => state.notification);
export const useBreadcrumbs = () => useUIStore((state) => state.breadcrumbs);
export const useModal = (key: string) => useUIStore((state) => state.modals[key] || false);