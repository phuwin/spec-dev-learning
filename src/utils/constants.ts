/**
 * Application constants
 * Centralized configuration values
 */

// Storage Keys
export const STORAGE_KEYS = {
  USERS: 'auth_users',
  SESSION: 'auth_session',
  REGISTRATION_ATTEMPTS: 'auth_registration_attempts',
  LOGIN_ATTEMPTS: 'auth_login_attempts',
  DEBUG: 'auth_debug'
} as const;

// Storage Limits
export const STORAGE_LIMITS = {
  MAX_ATTEMPTS: 100,
  MAX_EMAIL_LENGTH: 254,
  MAX_PASSWORD_LENGTH: 1000
} as const;

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  USER: '/api/auth/user'
} as const;

// Routes
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  HOME: '/'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  STORAGE_UNAVAILABLE: 'Storage is not available',
  QUOTA_EXCEEDED: 'Storage quota exceeded',
  DATA_CORRUPTION: 'Data corruption detected',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!'
} as const;

// Performance Targets
export const PERFORMANCE_TARGETS = {
  INITIAL_LOAD_MS: 3000,
  FORM_INTERACTION_MS: 200,
  STORAGE_OPERATION_MS: 50
} as const;
