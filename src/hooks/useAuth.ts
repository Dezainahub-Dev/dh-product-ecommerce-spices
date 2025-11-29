import { useState, useEffect, useCallback } from 'react';
import { authService, User, AuthResponse } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = authService.getAccessToken();
    if (token) {
      setIsAuthenticated(true);
      // Optionally fetch user profile
      authService.getProfile()
        .then((profile) => {
          setUser(profile);
        })
        .catch(() => {
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await authService.register(email, password, firstName, lastName);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
