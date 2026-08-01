/**
 * Authentication store using Zustand with persistence
 */

import { AuthState, User } from '../types/auth.types';
import { createJSONStorage, persist } from 'zustand/middleware';

import { authStorage } from '../utils/localStorage';
import { create } from 'zustand';

interface AuthStore extends AuthState {
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  isAdmin: () => boolean;
  isMember: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: (user: User, token: string) => {
        authStorage.setToken(token);
        authStorage.setUser(user);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        authStorage.clearAuth();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // Optional: redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      setUser: (user: User) => {
        authStorage.setUser(user);
        set({ user });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          authStorage.setUser(updatedUser);
          set({ user: updatedUser });
        }
      },

      isAdmin: () => {
        const user = get().user;
        return user?.role === 'admin';
      },

      isMember: () => {
        const user = get().user;
        return user?.role === 'member';
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for better performance
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useIsAdmin = () => useAuthStore((state) => state.isAdmin());
export const useIsMember = () => useAuthStore((state) => state.isMember());