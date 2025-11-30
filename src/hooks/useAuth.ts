import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function useAuth() {
  const { user, loading, isAuthenticated, login, register, logout, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
