/**
 * Authentication Service Contract
 * Frontend-only MVP using localStorage for persistence
 */

export interface AuthService {
  // User Registration
  register(email: string, password: string): Promise<RegistrationResult>;

  // User Login
  login(email: string, password: string): Promise<LoginResult>;

  // User Logout
  logout(): Promise<void>;

  // Session Management
  getCurrentUser(): Promise<User | null>;
  isAuthenticated(): Promise<boolean>;

  // User Management
  getUserByEmail(email: string): Promise<User | null>;
  updateLastLogin(userId: string): Promise<void>;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface RegistrationResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastActivityAt: string;
}

// Error Types
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ValidationError extends AuthError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

export class DuplicateEmailError extends AuthError {
  constructor(email: string) {
    super(`Email ${email} is already registered`, 'DUPLICATE_EMAIL');
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class UserNotFoundError extends AuthError {
  constructor(email: string) {
    super(`User with email ${email} not found`, 'USER_NOT_FOUND');
  }
}
