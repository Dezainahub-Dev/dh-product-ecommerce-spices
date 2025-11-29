# Authentication System - Frontend Setup Guide

This document provides a complete overview of the authentication system implemented in your e-commerce application.

## Features Implemented

### ✅ Authentication Pages
1. **Login Page** (`/login`)
   - Email and password validation with on-blur error messages
   - Show/hide password toggle
   - Remember redirect URL after login
   - OAuth integration buttons (Google, Microsoft, Facebook)
   - Comprehensive error handling

2. **Signup Page** (`/signup`)
   - First name, last name, email, and password fields
   - Strong frontend validation
   - On-blur validation for each field
   - Submit validation with error messages
   - Auto-redirect after successful registration

3. **Forgot Password Page** (`/forgot-password`)
   - Email validation
   - Success message after sending reset link
   - User-friendly UI matching the design system

4. **Profile Page** (`/profile`)
   - Fetches and displays real user data from API
   - Editable profile fields with validation
   - Gender selection and date of birth
   - Marketing opt-in checkbox
   - Address display (if available)
   - Loading and error states

### ✅ Navigation Integration
- Updated navbar with authentication state
- Shows user's first name when logged in
- Dropdown menu with:
  - Profile link
  - Wishlist link
  - Logout button
- Shows "Login" button when not authenticated
- Automatically fetches and displays user data

### ✅ Core Features
1. **Validation System**
   - Email format validation
   - Password strength (minimum 8 characters)
   - Name validation (letters only)
   - Phone number validation (E.164 format)
   - On-blur validation for better UX
   - Submit-time validation

2. **API Integration**
   - Centralized API client with automatic token refresh
   - Handles 401 errors and redirects to login
   - Stores access token in localStorage
   - HttpOnly cookies for refresh tokens
   - Automatic token refresh on expiry

3. **Security Features**
   - Password visibility toggle
   - Secure token storage
   - Automatic session management
   - Redirect preservation (returns to original page after login)
   - Protected routes

## File Structure

```
src/
├── app/
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── signup/
│   │   └── page.tsx              # Signup page
│   ├── forgot-password/
│   │   └── page.tsx              # Forgot password page
│   └── profile/
│       └── page.tsx              # Profile page wrapper
├── components/
│   ├── icons.tsx                 # All icons including auth icons
│   ├── navigation/
│   │   └── navbar.tsx            # Updated with auth integration
│   └── profile/
│       └── profile-page.tsx      # Profile component with API integration
├── hooks/
│   └── useAuth.ts                # Authentication hook
├── lib/
│   ├── api-client.ts             # Centralized API client
│   ├── auth.ts                   # Auth service functions
│   └── validators.ts             # Form validation utilities
└── .env.example                  # Environment variables template
```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required: Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: OAuth Provider IDs (if using social login)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

### 2. Install Dependencies

No additional dependencies are required! The implementation uses only the packages already in your `package.json`:
- Next.js 16
- React 19
- TypeScript
- Zustand (for state management)

### 3. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage Guide

### Authentication Flow

#### 1. **User Registration**
```typescript
// Navigate to /signup
// User fills form → Submit → API call → Auto-login → Redirect to original page or home
```

#### 2. **User Login**
```typescript
// Navigate to /login
// User fills form → Submit → API call → Store token → Redirect to original page or home
```

#### 3. **Logout**
```typescript
// Click user dropdown → Logout → Clear tokens → Redirect to login
```

### Using the Auth Hook

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```typescript
import { apiClient } from '@/lib/api-client';

// The API client automatically:
// 1. Adds the Authorization header with the access token
// 2. Handles token refresh on 401 errors
// 3. Redirects to login if refresh fails

async function fetchUserOrders() {
  const orders = await apiClient.get('/customer/orders');
  return orders;
}
```

### Validation

```typescript
import { validators } from '@/lib/validators';

// Email validation
const emailError = validators.email('user@example.com');
// Returns null if valid, error message if invalid

// Password validation
const passwordError = validators.password('mypassword');
// Returns null if valid (>= 8 chars), error message if invalid

// Phone validation
const phoneError = validators.phone('+1234567890');
// Returns null if valid E.164 format, error message if invalid
```

## API Endpoints Used

### Authentication Endpoints
- `POST /customer/auth/register` - Register new user
- `POST /customer/auth/login` - Login user
- `POST /customer/auth/logout` - Logout user
- `POST /customer/auth/refresh` - Refresh access token
- `POST /customer/auth/forgot-password` - Send password reset email

### Profile Endpoints
- `GET /customer/me` - Get current user profile
- `PATCH /customer/me` - Update user profile
- `PATCH /customer/me/change-password` - Change password

### OAuth Endpoints
- `GET /customer/auth/google` - Google OAuth
- `GET /customer/auth/microsoft` - Microsoft OAuth
- `GET /customer/auth/facebook` - Facebook OAuth

## Design System

The authentication pages follow your existing design system:

### Colors Used
- **Primary**: `#4D9C2C` (Green)
- **Primary Dark**: `#355B20`
- **Background**: `#F8FCF2`, `#F6FCEA`
- **Border**: `#E6EEDF`, `#E5EED5`
- **Error**: `#E53935`
- **Error Background**: `#FEEFEF`

### Typography
- Headings: Font weight 600 (semibold)
- Labels: Uppercase with 0.3em letter spacing
- Text: Base size 16px, small size 14px

### Components
- Rounded corners: `rounded-xl` (12px), `rounded-3xl` (24px)
- Shadows: Subtle green shadows for primary buttons
- Inputs: Border with focus states
- Buttons: Uppercase text with green background

## Validation Rules

### Email
- Required field
- Valid email format (`user@example.com`)

### Password
- Required field
- Minimum 8 characters

### First Name / Last Name
- Required field
- Minimum 2 characters
- Letters only (no numbers or special characters)

### Phone (Optional)
- E.164 format recommended (`+1234567890`)
- Validated only when provided

## Error Handling

The system handles various error scenarios:

1. **Network Errors**: Shows user-friendly message
2. **Validation Errors**: Displays field-specific errors on blur
3. **API Errors**: Shows error message from backend
4. **Session Expiry**: Automatically attempts token refresh
5. **Unauthorized Access**: Redirects to login with return URL

## Security Best Practices

✅ **Implemented**:
- Access tokens stored in localStorage (short-lived: 15 minutes)
- Refresh tokens stored in HttpOnly cookies (long-lived: 7 days)
- Password visibility toggle
- Automatic token refresh
- CSRF protection via cookies
- Redirect preservation

⚠️ **Recommendations**:
- Use HTTPS in production
- Implement rate limiting on backend
- Add CAPTCHA for signup/login (optional)
- Enable 2FA (future enhancement)

## Troubleshooting

### Issue: "Session expired" message
**Solution**: The refresh token has expired. User needs to login again.

### Issue: CORS errors
**Solution**: Ensure backend allows credentials:
```typescript
// Backend (Express example)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

### Issue: Redirect not working after login
**Solution**: Check if the `redirect` query parameter is preserved:
```typescript
// Should be: /login?redirect=/checkout
```

### Issue: Profile not loading
**Solution**: Check:
1. Access token is present in localStorage
2. Backend API is running
3. API URL is correct in `.env.local`

## Testing

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with registered user
- [ ] Logout
- [ ] Forgot password flow
- [ ] Edit profile
- [ ] Update profile picture (if implemented)
- [ ] Change password
- [ ] Access protected routes
- [ ] Token refresh on expiry
- [ ] Error messages display correctly
- [ ] Validation works on blur
- [ ] OAuth buttons redirect correctly

## Next Steps

Future enhancements you might consider:

1. **Email Verification**: Require users to verify their email
2. **Password Reset**: Complete the reset password flow
3. **Two-Factor Authentication**: Add 2FA for extra security
4. **Social Login**: Complete OAuth integration
5. **Profile Picture Upload**: Allow users to upload avatars
6. **Address Management**: Full CRUD for multiple addresses
7. **Account Settings**: More granular privacy settings

## Support

For backend API documentation, refer to:
- `docs/CUSTOMER_AUTH_FRONTEND_INTEGRATION.md`

For questions or issues, please check:
1. Environment variables are set correctly
2. Backend API is running and accessible
3. CORS is configured properly
4. Cookies are enabled in browser

---

**Created**: November 2025
**Version**: 1.0.0
**Framework**: Next.js 16 + React 19
