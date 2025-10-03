/**
 * User-related type definitions
 * Based on data-model.md specifications
 */

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserSession {
  userId: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastActivityAt: string;
}

export interface RegistrationAttempt {
  email: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

export interface LoginAttempt {
  email: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

// Public user interface (without password)
export interface User {
  id: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
}
