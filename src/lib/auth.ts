import { apiClient } from './api-client';

export interface User {
  uid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
  dateOfBirth?: string | null;
  marketingOptIn?: boolean;
  avatarUrl?: string | null;
  isVerified?: boolean;
  lastLoginAt?: string | null;
  ordersCount?: number;
  addressesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ProfileResponse extends User {
  defaultAddress?: {
    uid: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone: string | null;
    isDefault: boolean;
  };
}

export const authService = {
  async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/customer/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });

    apiClient.setAccessToken(response.accessToken);
    return response;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/customer/auth/login', {
      email,
      password,
    });

    apiClient.setAccessToken(response.accessToken);
    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/customer/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.setAccessToken(null);
    }
  },

  async getProfile(): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>('/customer/me');
  },

  async updateProfile(updates: Partial<ProfileResponse>): Promise<ProfileResponse> {
    return apiClient.patch<ProfileResponse>('/customer/me', updates);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.patch('/customer/me/change-password', {
      currentPassword,
      newPassword,
    });
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/customer/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/customer/auth/reset-password', {
      token,
      newPassword,
    });
  },

  isAuthenticated(): boolean {
    return !!apiClient.getAccessToken();
  },

  getAccessToken(): string | null {
    return apiClient.getAccessToken();
  },
};
