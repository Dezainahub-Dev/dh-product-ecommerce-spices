# Customer Authentication - Frontend Integration Guide

This guide provides complete documentation for integrating customer authentication APIs in your frontend application.

## Table of Contents

1. [Overview](#overview)
2. [Environment Setup](#environment-setup)
3. [Authentication Flow](#authentication-flow)
4. [API Endpoints](#api-endpoints)
5. [Customer Profile Endpoints](#customer-profile-endpoints)
6. [Token Management](#token-management)
7. [Cookie Handling](#cookie-handling)
8. [OAuth Integration](#oauth-integration)
9. [Error Handling](#error-handling)
10. [Code Examples](#code-examples)

---

## Overview

The customer authentication system uses:

- **JWT Access Tokens** - Short-lived tokens (default: 15 minutes) for API authentication
- **Refresh Tokens** - Long-lived tokens (default: 7 days) stored as HttpOnly cookies
- **HttpOnly Cookies** - Secure storage for refresh tokens (prevents XSS attacks)

### Base URL

All customer authentication endpoints are prefixed with `/customer/auth`:

```
Base URL: https://your-api-domain.com/customer/auth
```

---

## Environment Setup

### Required Environment Variables

Create a `.env` file in your frontend project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
# or for production:
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# OAuth Configuration (if using OAuth)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

### Backend Environment Variables

The backend requires these environment variables (configured on the server):

```env
# Customer JWT Configuration
CUSTOMER_JWT_SECRET=your_super_secret_key_here
CUSTOMER_ACCESS_TOKEN_TTL=15m
CUSTOMER_REFRESH_TOKEN_TTL=7d
CUSTOMER_PASSWORD_RESET_TOKEN_TTL=1h

# OAuth Provider Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Domain Configuration
DOMAIN=yourdomain.com
USE_HTTPS=true
```

---

## Authentication Flow

### Registration Flow

```
1. User submits registration form
2. Frontend sends POST /customer/auth/register
3. Backend creates user account
4. Backend returns accessToken + user data
5. Backend sets refreshToken as HttpOnly cookie
6. Frontend stores accessToken in memory/localStorage
7. Frontend redirects to dashboard
```

### Login Flow

```
1. User submits login form
2. Frontend sends POST /customer/auth/login
3. Backend validates credentials
4. Backend returns accessToken + user data
5. Backend sets refreshToken as HttpOnly cookie
6. Frontend stores accessToken in memory/localStorage
7. Frontend redirects to dashboard
```

### Token Refresh Flow

```
1. Access token expires (after 15 minutes)
2. Frontend detects 401 Unauthorized response
3. Frontend calls POST /customer/auth/refresh
4. Backend validates refresh token from cookie
5. Backend returns new accessToken
6. Frontend updates stored accessToken
7. Frontend retries original request
```

### Logout Flow

```
1. User clicks logout
2. Frontend calls POST /customer/auth/logout (with accessToken)
3. Backend clears refreshToken cookie
4. Frontend clears accessToken from storage
5. Frontend redirects to login page
```

---

## API Endpoints

### 1. Register

**Endpoint:** `POST /customer/auth/register`

**Description:** Creates a new customer account

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John", // Optional
  "lastName": "Doe" // Optional
}
```

**Validation Rules:**

- `email`: Valid email format, required
- `password`: Minimum 8 characters, required
- `firstName`: Optional string
- `lastName`: Optional string

**Response (201 Created):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Note:** The refresh token is automatically set as an HttpOnly cookie named `customer_refresh_token`.

**Error Responses:**

- `409 Conflict`: User with this email already exists
- `400 Bad Request`: Validation errors

---

### 2. Login

**Endpoint:** `POST /customer/auth/login`

**Description:** Authenticates a customer and returns tokens

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Note:** The refresh token is automatically set as an HttpOnly cookie.

**Error Responses:**

- `401 Unauthorized`: Invalid email or password
- `400 Bad Request`: Validation errors

---

### 3. Logout

**Endpoint:** `POST /customer/auth/logout`

**Description:** Logs out the current user and clears tokens

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**

```json
{
  "message": "Logged out successfully"
}
```

**Note:** This endpoint clears the refresh token cookie automatically.

---

### 4. Refresh Token

**Endpoint:** `POST /customer/auth/refresh`

**Description:** Refreshes the access token using the refresh token

**Request:**

- No body required
- Refresh token is automatically read from `customer_refresh_token` cookie
- OR can be sent in Authorization header: `Bearer <refreshToken>`

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

- `401 Unauthorized`: Invalid or expired refresh token

---

### 5. Forgot Password

**Endpoint:** `POST /customer/auth/forgot-password`

**Description:** Sends a password reset email to the user

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**

```json
{
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

**Note:** The response is always the same regardless of whether the email exists (security best practice).

---

### 6. Reset Password

**Endpoint:** `POST /customer/auth/reset-password`

**Description:** Resets the password using a token from the reset email

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePassword123!"
}
```

**Validation Rules:**

- `token`: Required string (from email link)
- `newPassword`: Minimum 8 characters, required

**Response (200 OK):**

```json
{
  "message": "Password has been reset successfully"
}
```

**Error Responses:**

- `404 Not Found`: Invalid or expired reset token
- `400 Bad Request`: Token already used or validation errors

---

### 7. Get Login History

**Endpoint:** `GET /customer/auth/login-history`

**Description:** Returns recent login attempts for the current user

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**

```json
[
  {
    "id": 1,
    "userId": 123,
    "email": "user@example.com",
    "success": true,
    "reason": "LOGIN_SUCCESS",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "userId": 123,
    "email": "user@example.com",
    "success": false,
    "reason": "INVALID_PASSWORD",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2024-01-15T09:15:00Z"
  }
]
```

---

## Customer Profile Endpoints

All profile endpoints require authentication. Include the access token in the Authorization header.

### Base URL

All customer profile endpoints are prefixed with `/customer`:

```
Base URL: https://your-api-domain.com/customer
```

### 8. Get Current User Profile

**Endpoint:** `GET /customer/me`

**Description:** Returns the complete profile information of the authenticated customer, including user ID (uid), personal information, and default address.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**

```json
{
  "uid": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "marketingOptIn": true,
  "avatarUrl": "https://example.com/avatar.jpg",
  "isVerified": false,
  "lastLoginAt": "2024-01-15T10:30:00.000Z",
  "defaultAddress": {
    "uid": "address-uid-here",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001",
    "phone": "+1234567890",
    "isDefault": true
  }
}
```

**Note:** The `defaultAddress` field is optional and will be `undefined` if the user has no default address set.

**Gender Enum Values:**

- `MALE`
- `FEMALE`
- `OTHER`
- `PREFER_NOT_TO_SAY`

**Error Responses:**

- `401 Unauthorized`: Invalid or expired access token
- `404 Not Found`: User not found

---

### 9. Update Profile

**Endpoint:** `PATCH /customer/me`

**Description:** Updates the profile information of the authenticated customer. All fields are optional - only include the fields you want to update.

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01",
  "marketingOptIn": true
}
```

**Field Validation:**

- `firstName`: Optional string
- `lastName`: Optional string
- `phone`: Optional string, must be in E.164 format (e.g., `+1234567890`)
- `gender`: Optional enum - `MALE`, `FEMALE`, `OTHER`, `PREFER_NOT_TO_SAY`
- `dateOfBirth`: Optional ISO date string (YYYY-MM-DD), cannot be in the future
- `marketingOptIn`: Optional boolean

**Response (200 OK):**

```json
{
  "uid": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "gender": "MALE",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "marketingOptIn": true,
  "avatarUrl": "https://example.com/avatar.jpg",
  "isVerified": false,
  "lastLoginAt": "2024-01-15T10:30:00.000Z",
  "defaultAddress": {
    "uid": "address-uid-here",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postalCode": "10001",
    "phone": "+1234567890",
    "isDefault": true
  }
}
```

**Error Responses:**

- `400 Bad Request`:
  - Validation errors (invalid phone format, date in future, etc.)
  - Phone number already in use by another user
- `401 Unauthorized`: Invalid or expired access token
- `404 Not Found`: User not found

---

### 10. Change Password

**Endpoint:** `PATCH /customer/me/change-password`

**Description:** Changes the password for the authenticated customer. Requires the current password for verification.

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**

```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewSecurePassword123!"
}
```

**Validation Rules:**

- `currentPassword`: Required string - must match the user's current password
- `newPassword`: Required string, minimum 8 characters

**Response (200 OK):**

```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**

- `400 Bad Request`: Validation errors (e.g., new password too short)
- `401 Unauthorized`:
  - Invalid or expired access token
  - Current password is incorrect
- `404 Not Found`: User not found

**Security Note:** After changing the password, the user may need to re-authenticate. Consider logging the user out and requiring them to log in again with the new password.

---

## OAuth Integration

### Google OAuth

**Initiate Login:**

```
GET /customer/auth/google
```

Redirect the user to this URL to start the Google OAuth flow. The backend will handle the OAuth redirect automatically.

**Callback URL:** `/customer/auth/google/callback`

The callback is handled automatically by the backend. After successful authentication, the user will be redirected back to your frontend with tokens set.

**Frontend Implementation:**

```typescript
// Redirect user to Google OAuth
window.location.href = `${API_URL}/customer/auth/google`;
```

### Microsoft OAuth

**Initiate Login:**

```
GET /customer/auth/microsoft
```

**Callback URL:** `/customer/auth/microsoft/callback`

```typescript
// Redirect user to Microsoft OAuth
window.location.href = `${API_URL}/customer/auth/microsoft`;
```

### Facebook OAuth

**Initiate Login:**

```
GET /customer/auth/facebook
```

**Callback URL:** `/customer/auth/facebook/callback`

```typescript
// Redirect user to Facebook OAuth
window.location.href = `${API_URL}/customer/auth/facebook`;
```

### OAuth Callback Handling

After OAuth authentication, the backend will:

1. Create or find the user account
2. Set the refresh token as an HttpOnly cookie
3. Redirect to your frontend with the access token

**Recommended Frontend Flow:**

```typescript
// In your OAuth callback page (e.g., /auth/callback)
useEffect(() => {
  // The backend redirects here after OAuth
  // Extract access token from URL or make a request to get user info
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('accessToken');

  if (accessToken) {
    // Store access token
    localStorage.setItem('accessToken', accessToken);
    // Redirect to dashboard
    router.push('/dashboard');
  }
}, []);
```

---

## Token Management

### Access Token

- **Storage:** Store in memory (React state) or localStorage
- **Lifetime:** 15 minutes (default)
- **Usage:** Include in Authorization header for protected API calls
- **Format:** `Bearer <accessToken>`

### Refresh Token

- **Storage:** HttpOnly cookie (automatically managed by browser)
- **Lifetime:** 7 days (default)
- **Usage:** Automatically sent with requests to `/customer/auth/refresh`
- **Security:** HttpOnly prevents JavaScript access (XSS protection)

### Token Refresh Strategy

Implement automatic token refresh when access token expires:

```typescript
// Interceptor for automatic token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the access token
        const response = await axios.post(
          `${API_URL}/customer/auth/refresh`,
          {},
          {
            withCredentials: true, // Important: sends cookies
          },
        );

        const { accessToken } = response.data;

        // Update stored access token
        localStorage.setItem('accessToken', accessToken);

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
```

---

## Cookie Handling

### Important Notes

1. **HttpOnly Cookies:** The refresh token is stored as an HttpOnly cookie, which means:
   - JavaScript cannot access it (prevents XSS attacks)
   - Automatically sent with requests to the same domain
   - Cannot be read via `document.cookie`

2. **CORS Configuration:** For cross-origin requests, ensure:
   - Backend allows credentials: `Access-Control-Allow-Credentials: true`
   - Frontend sends credentials: `withCredentials: true` in fetch/axios

3. **SameSite Policy:** Cookies use `sameSite: 'strict'` for security

### Fetch Example with Cookies

```typescript
fetch(`${API_URL}/customer/auth/refresh`, {
  method: 'POST',
  credentials: 'include', // Important: sends cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Axios Example with Cookies

```typescript
axios.post(
  `${API_URL}/customer/auth/refresh`,
  {},
  {
    withCredentials: true, // Important: sends cookies
  },
);
```

---

## Error Handling

### Common Error Responses

| Status Code | Error                 | Description                                    |
| ----------- | --------------------- | ---------------------------------------------- |
| 400         | Bad Request           | Validation errors or invalid input             |
| 401         | Unauthorized          | Invalid credentials or expired token           |
| 404         | Not Found             | Resource not found (e.g., invalid reset token) |
| 409         | Conflict              | User already exists (registration)             |
| 500         | Internal Server Error | Server error                                   |

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Handling Errors in Frontend

```typescript
try {
  const response = await fetch(`${API_URL}/customer/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  // Handle success
} catch (error) {
  // Handle error
  console.error('Login error:', error.message);
}
```

---

## Code Examples

### React/Next.js Example

#### 1. Authentication Hook

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  uid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load token from storage
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      // Optionally fetch user info
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(
      `${API_URL}/customer/auth/login`,
      { email, password },
      { withCredentials: true },
    );

    const { accessToken, user } = response.data;
    setAccessToken(accessToken);
    setUser(user);
    localStorage.setItem('accessToken', accessToken);

    return { accessToken, user };
  };

  const register = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => {
    const response = await axios.post(
      `${API_URL}/customer/auth/register`,
      { email, password, firstName, lastName },
      { withCredentials: true },
    );

    const { accessToken, user } = response.data;
    setAccessToken(accessToken);
    setUser(user);
    localStorage.setItem('accessToken', accessToken);

    return { accessToken, user };
  };

  const logout = async () => {
    if (accessToken) {
      await axios.post(
        `${API_URL}/customer/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        },
      );
    }

    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/customer/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const { accessToken } = response.data;
      setAccessToken(accessToken);
      localStorage.setItem('accessToken', accessToken);

      return accessToken;
    } catch (error) {
      // Refresh failed, logout user
      logout();
      throw error;
    }
  };

  return {
    user,
    accessToken,
    loading,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!accessToken,
  };
}
```

#### 2. Axios Interceptor Setup

```typescript
// lib/axios.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Always send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add access token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/customer/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
```

#### 3. Login Component

```typescript
// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

#### 4. Protected Route Component

```typescript
// components/ProtectedRoute.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

#### 5. OAuth Login Buttons

```typescript
// components/OAuthButtons.tsx
'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OAuthButtons() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/customer/auth/google`;
  };

  const handleMicrosoftLogin = () => {
    window.location.href = `${API_URL}/customer/auth/microsoft`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}/customer/auth/facebook`;
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Login with Google</button>
      <button onClick={handleMicrosoftLogin}>Login with Microsoft</button>
      <button onClick={handleFacebookLogin}>Login with Facebook</button>
    </div>
  );
}
```

#### 6. Profile Hook

```typescript
// hooks/useProfile.ts
import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';

interface Profile {
  uid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
  dateOfBirth: string | null;
  marketingOptIn: boolean;
  avatarUrl: string | null;
  isVerified: boolean;
  lastLoginAt: string | null;
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

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/customer/me');
      setProfile(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setError(null);
      const response = await apiClient.patch('/customer/me', updates);
      setProfile(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      setError(null);
      await apiClient.patch('/customer/me/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
  };
}
```

#### 7. Profile Component

```typescript
// components/ProfilePage.tsx
'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const { profile, loading, error, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    marketingOptIn: false,
  });
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        marketingOptIn: profile.marketingOptIn,
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError('');

    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (err: any) {
      setUpdateError(err.message);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <div>
      <h1>Profile</h1>

      {updateError && <div className="error">{updateError}</div>}

      {!editing ? (
        <div>
          <p><strong>User ID:</strong> {profile.uid}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
          <p><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
          <p><strong>Gender:</strong> {profile.gender || 'Not set'}</p>
          <p><strong>Date of Birth:</strong> {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}</p>
          <p><strong>Marketing Opt-In:</strong> {profile.marketingOptIn ? 'Yes' : 'No'}</p>
          <p><strong>Verified:</strong> {profile.isVerified ? 'Yes' : 'No'}</p>

          {profile.defaultAddress && (
            <div>
              <h3>Default Address</h3>
              <p>{profile.defaultAddress.line1}</p>
              {profile.defaultAddress.line2 && <p>{profile.defaultAddress.line2}</p>}
              <p>{profile.defaultAddress.city}, {profile.defaultAddress.state} {profile.defaultAddress.postalCode}</p>
              <p>{profile.defaultAddress.country}</p>
            </div>
          )}

          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="First Name"
          />
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Last Name"
          />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone (e.g., +1234567890)"
          />
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </select>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
          <label>
            <input
              type="checkbox"
              checked={formData.marketingOptIn}
              onChange={(e) => setFormData({ ...formData, marketingOptIn: e.target.checked })}
            />
            Marketing Opt-In
          </label>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}
```

#### 8. Change Password Component

```typescript
// components/ChangePasswordForm.tsx
'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';

export default function ChangePasswordForm() {
  const { changePassword } = useProfile();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Change Password</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">Password changed successfully!</div>}

      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Current Password"
        required
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password (min 8 characters)"
        required
        minLength={8}
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm New Password"
        required
        minLength={8}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Changing Password...' : 'Change Password'}
      </button>
    </form>
  );
}
```

---

## Security Best Practices

1. **Never store access tokens in localStorage for production** - Consider using httpOnly cookies or secure memory storage
2. **Always use HTTPS in production** - Required for secure cookie transmission
3. **Implement CSRF protection** - For state-changing operations
4. **Validate tokens on the frontend** - Check expiration before making requests
5. **Handle token refresh gracefully** - Don't show errors to users during automatic refresh
6. **Clear tokens on logout** - Remove from storage and call logout endpoint
7. **Use secure cookie settings** - Backend handles this, but ensure HTTPS

---

## Testing

### Test Registration

```bash
curl -X POST http://localhost:3000/customer/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "firstName": "Test",
    "lastName": "User"
  }' \
  -c cookies.txt
```

### Test Login

```bash
curl -X POST http://localhost:3000/customer/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }' \
  -c cookies.txt
```

### Test Protected Endpoint

```bash
curl -X GET http://localhost:3000/customer/auth/login-history \
  -H "Authorization: Bearer <accessToken>" \
  -b cookies.txt
```

---

## Support

For issues or questions:

1. Check the API documentation at `/swagger`
2. Review error messages in the response
3. Check browser console for network errors
4. Verify environment variables are set correctly

---

## Changelog

- **v1.0.0** - Initial customer authentication API
  - Registration and login
  - Token refresh mechanism
  - OAuth integration (Google, Microsoft, Facebook)
  - Password reset flow
  - Login history tracking
