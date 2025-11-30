import { create } from 'zustand';
import { authService, User, AuthResponse } from '@/lib/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  initialize: async () => {
    const token = authService.getAccessToken();
    if (token) {
      try {
        const profile = await authService.getProfile();
        set({ user: profile, isAuthenticated: true, loading: false });
      } catch (error: any) {
        // Only clear auth if it's not a network error
        if (error.message?.includes('Session expired') || error.message?.includes('401')) {
          set({ isAuthenticated: false, user: null, loading: false });
        } else {
          // Keep user logged in if offline or network error
          set({ loading: false });
        }
      }
    } else {
      set({ loading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const response = await authService.login(email, password);
      set({ user: response.user, isAuthenticated: true, loading: false });
      return response;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    set({ loading: true });
    try {
      const response = await authService.register(email, password, firstName, lastName);
      set({ user: response.user, isAuthenticated: true, loading: false });
      return response;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
      set({ user: null, isAuthenticated: false, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
}));
