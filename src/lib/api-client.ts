const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dh-ecom-backend.vercel.app';

interface RequestOptions extends RequestInit {
  data?: any;
}

class APIClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
    }
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { data, headers = {}, ...restOptions } = options;

    const config: RequestInit = {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      } as HeadersInit,
      credentials: 'include', // Important: sends cookies
    };

    // Add authorization header if access token exists
    if (this.accessToken) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    // Add body if data is provided
    if (data) {
      config.body = JSON.stringify(data);
    }

    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, config);

    // Handle 401 Unauthorized
    if (response.status === 401 && endpoint !== '/api/customer/auth/refresh') {
      // Try to refresh the token
      try {
        const refreshResponse = await fetch(`${this.baseURL}/api/customer/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          this.setAccessToken(refreshData.accessToken);

          // Retry the original request
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${refreshData.accessToken}`;
          const retryResponse = await fetch(url, config);

          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'Request failed');
          }

          return retryResponse.json();
        } else {
          // Refresh failed, clear token and redirect to login
          this.setAccessToken(null);
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }
          throw new Error('Session expired. Please login again.');
        }
      } catch (refreshError) {
        this.setAccessToken(null);
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        }
        throw refreshError;
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return {} as T;
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', data });
  }

  async patch<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', data });
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new APIClient(API_URL);
