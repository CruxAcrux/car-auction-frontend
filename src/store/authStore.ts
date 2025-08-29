import { create } from 'zustand';
import type { LoginForm, RegisterForm, AuthResponse } from '../types';
import { login, register, refreshToken } from '../api/api';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  userId: string | null;
  error: string | null;
  login: (data: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  userId: localStorage.getItem('userId'),
  error: null,
  login: async (data: LoginForm) => {
    try {
      const response: AuthResponse = await login(data);
      if (!response.userId) {
        throw new Error('User ID not provided in authentication response');
      }
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userId', response.userId);
      set({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userId: response.userId,
        isAuthenticated: true,
        error: null,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid credentials';
      set({ error: message });
      throw new Error(message);
    }
  },
  register: async (data: RegisterForm) => {
    try {
      const response: AuthResponse = await register(data);
      if (!response.userId) {
        throw new Error('User ID not provided in registration response');
      }
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userId', response.userId);
      set({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        userId: response.userId,
        isAuthenticated: true,
        error: null,
      });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message });
      throw new Error(message);
    }
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    set({
      accessToken: null,
      refreshToken: null,
      userId: null,
      isAuthenticated: false,
      error: null,
    });
  },
  refresh: async () => {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (refreshTokenValue) {
      try {
        const response: AuthResponse = await refreshToken(refreshTokenValue);
        if (!response.userId) {
          throw new Error('User ID not provided in refresh token response');
        }
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('userId', response.userId);
        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          userId: response.userId,
          isAuthenticated: true,
          error: null,
        });
      } catch (err: any) {
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          isAuthenticated: false,
          error: err.message || 'Refresh failed',
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        throw err;
      }
    } else {
      set({
        accessToken: null,
        refreshToken: null,
        userId: null,
        isAuthenticated: false,
        error: 'No refresh token available',
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
    }
  },
}));