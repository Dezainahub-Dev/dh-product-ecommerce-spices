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

// Helper functions for localStorage
const STORAGE_KEYS = {
  USER: 'auth_user',
  IS_AUTHENTICATED: 'auth_is_authenticated',
};

const saveAuthToStorage = (user: User | null, isAuthenticated: boolean) => {
  if (typeof window !== 'undefined') {
    if (user && isAuthenticated) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
    }
  }
};

const loadAuthFromStorage = (): { user: User | null; isAuthenticated: boolean } => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const isAuthStr = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);

    if (userStr && isAuthStr === 'true') {
      try {
        return {
          user: JSON.parse(userStr),
          isAuthenticated: true,
        };
      } catch (e) {
        return { user: null, isAuthenticated: false };
      }
    }
  }
  return { user: null, isAuthenticated: false };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  initialize: async () => {
    const token = authService.getAccessToken();
    const storedAuth = loadAuthFromStorage();

    if (token) {
      // If we have a token, try to fetch fresh profile data
      try {
        const profile = await authService.getProfile();
        set({ user: profile, isAuthenticated: true, loading: false });
        saveAuthToStorage(profile, true);
      } catch (error: any) {
        // If fetching profile fails, use stored data if available
        // This keeps the user logged in even if the token refresh fails
        if (storedAuth.user && storedAuth.isAuthenticated) {
          set({
            user: storedAuth.user,
            isAuthenticated: true,
            loading: false
          });
        } else {
          // Only log out if we don't have stored auth data
          set({ isAuthenticated: false, user: null, loading: false });
          saveAuthToStorage(null, false);
        }
      }
    } else if (storedAuth.user && storedAuth.isAuthenticated) {
      // No token but we have stored auth - keep user logged in
      set({
        user: storedAuth.user,
        isAuthenticated: true,
        loading: false
      });
    } else {
      set({ loading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const response = await authService.login(email, password);
      set({ user: response.user, isAuthenticated: true, loading: false });
      saveAuthToStorage(response.user, true);
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
      saveAuthToStorage(response.user, true);
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
      saveAuthToStorage(null, false);
    } catch (error) {
      set({ loading: false });
      // Even if logout API fails, clear local auth state
      set({ user: null, isAuthenticated: false, loading: false });
      saveAuthToStorage(null, false);
      throw error;
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
    saveAuthToStorage(user, !!user);
  },
}));
