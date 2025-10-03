/**
 * LocalStorage Service Contract
 * Handles all localStorage operations for the authentication system
 */

export interface LocalStorageService {
  // User Storage
  saveUser(user: User): Promise<void>;
  getUser(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;

  // Session Storage
  saveSession(session: AuthSession): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  clearSession(): Promise<void>;

  // Attempt Logging
  logRegistrationAttempt(attempt: RegistrationAttempt): Promise<void>;
  logLoginAttempt(attempt: LoginAttempt): Promise<void>;
  getRegistrationAttempts(): Promise<RegistrationAttempt[]>;
  getLoginAttempts(): Promise<LoginAttempt[]>;

  // Utility Methods
  clearAll(): Promise<void>;
  isAvailable(): boolean;
  getStorageSize(): number;
}

export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthSession {
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

// Error Types
export class LocalStorageError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'LocalStorageError';
  }
}

export class QuotaExceededError extends LocalStorageError {
  constructor() {
    super('localStorage quota exceeded', 'QUOTA_EXCEEDED');
  }
}

export class DataCorruptionError extends LocalStorageError {
  constructor(key: string) {
    super(`Data corruption detected in key: ${key}`, 'DATA_CORRUPTION');
  }
}

export class StorageUnavailableError extends LocalStorageError {
  constructor() {
    super('localStorage is not available', 'STORAGE_UNAVAILABLE');
  }
}
