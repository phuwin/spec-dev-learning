# Quickstart: User Registration and Login

**Feature**: 001-user-can-register  
**Date**: 2024-12-19  
**Type**: Frontend MVP with localStorage authentication

## Overview

This feature provides user registration and login functionality for a frontend-only MVP. All user data is stored in localStorage, and sessions persist until explicit logout.

## Prerequisites

- Modern web browser with localStorage support
- Node.js 18+ and npm/yarn
- React 19, Vite 7, TypeScript 5.0+

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## User Flows

### 1. User Registration

**Scenario**: New user creates an account

**Steps**:
1. Navigate to `/register`
2. Enter email address (e.g., `user@example.com`)
3. Enter password (any non-empty string)
4. Click "Register" button
5. **Expected**: User is registered and automatically logged in
6. **Expected**: Redirected to dashboard with success message

**Validation**:
- Email must contain @ symbol
- Password must not be empty
- Email must be unique (not already registered)

**Error Cases**:
- Invalid email format → Show "Please enter a valid email address"
- Empty password → Show "Password is required"
- Duplicate email → Show "Email is already registered"

### 2. User Login

**Scenario**: Existing user logs in

**Steps**:
1. Navigate to `/login`
2. Enter registered email address
3. Enter correct password
4. Click "Login" button
5. **Expected**: User is logged in successfully
6. **Expected**: Redirected to dashboard with welcome message

**Validation**:
- Email must exist in localStorage
- Password must match stored password

**Error Cases**:
- Invalid credentials → Show "Invalid email or password"
- User not found → Show "Invalid email or password"

### 3. User Logout

**Scenario**: Logged-in user logs out

**Steps**:
1. While logged in, click "Logout" button
2. **Expected**: User is logged out
3. **Expected**: Redirected to login page
4. **Expected**: Session cleared from localStorage

### 4. Session Persistence

**Scenario**: User closes browser and returns

**Steps**:
1. Register and login as user
2. Close browser completely
3. Reopen browser and navigate to app
4. **Expected**: User remains logged in
5. **Expected**: Dashboard shows user's email

## API Reference

### AuthService

```typescript
// Register new user
const result = await authService.register('user@example.com', 'password123');
if (result.success) {
  console.log('User registered:', result.user);
} else {
  console.error('Registration failed:', result.error);
}

// Login existing user
const result = await authService.login('user@example.com', 'password123');
if (result.success) {
  console.log('User logged in:', result.user);
} else {
  console.error('Login failed:', result.error);
}

// Logout user
await authService.logout();

// Check if user is authenticated
const isAuth = await authService.isAuthenticated();

// Get current user
const user = await authService.getCurrentUser();
```

### LocalStorageService

```typescript
// Save user to localStorage
await localStorageService.saveUser({
  id: 'uuid',
  email: 'user@example.com',
  password: 'hashed-password',
  createdAt: '2024-12-19T10:00:00Z'
});

// Get all users
const users = await localStorageService.getAllUsers();

// Save session
await localStorageService.saveSession({
  userId: 'uuid',
  email: 'user@example.com',
  isActive: true,
  createdAt: '2024-12-19T10:00:00Z',
  lastActivityAt: '2024-12-19T10:00:00Z'
});
```

## Testing

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration
```

### Manual Testing Checklist

- [ ] Register new user with valid email/password
- [ ] Register fails with invalid email format
- [ ] Register fails with empty password
- [ ] Register fails with duplicate email
- [ ] Login with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] Login fails with non-existent email
- [ ] Logout clears session
- [ ] Session persists across browser restart
- [ ] Form validation shows appropriate error messages
- [ ] Success messages display after successful operations
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Accessibility features work with keyboard navigation

## Troubleshooting

### Common Issues

**localStorage quota exceeded**:
- Clear browser data or use incognito mode
- The app will automatically clear attempt logs if quota is exceeded

**Session not persisting**:
- Check if localStorage is enabled in browser
- Verify browser supports localStorage API

**Form validation not working**:
- Check browser console for JavaScript errors
- Verify TypeScript compilation is successful

**Tests failing**:
- Run `npm run test` to see specific error messages
- Check if all dependencies are installed
- Verify test environment setup

### Debug Mode

Enable debug logging by setting localStorage item:
```javascript
localStorage.setItem('auth_debug', 'true');
```

This will log all authentication operations to the browser console.

## Performance

- Initial page load: <3 seconds
- Form interactions: <200ms response time
- localStorage operations: <50ms
- Bundle size: <500KB gzipped

## Security Notes

- Passwords are stored in localStorage (not recommended for production)
- No password hashing implemented (MVP scope)
- No CSRF protection (frontend-only)
- No XSS protection beyond basic input sanitization

**This is a demonstration MVP and should not be used in production environments.**
