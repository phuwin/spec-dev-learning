/**
 * LocalStorage Service Implementation
 * Handles all localStorage operations for the authentication system
 */

import type {
  User,
  AuthSession,
  RegistrationAttempt,
  LoginAttempt,
} from '../types/user';
import { STORAGE_KEYS, STORAGE_LIMITS } from '../utils/constants';

// LocalStorage Service Interface
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

export class LocalStorageServiceImpl implements LocalStorageService {
  // User Storage
  async saveUser(user: User): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const existingUserIndex = users.findIndex((u) => u.id === user.id);

      if (existingUserIndex >= 0) {
        users[existingUserIndex] = user;
      } else {
        users.push(user);
      }

      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'QuotaExceededError'
      ) {
        throw new QuotaExceededError();
      }
      throw new LocalStorageError('Failed to save user', 'SAVE_USER_ERROR');
    }
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find((user) => user.id === id) || null;
    } catch (error) {
      throw new LocalStorageError('Failed to get user', 'GET_USER_ERROR');
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!usersJson) return [];

      const users = JSON.parse(usersJson);
      if (!Array.isArray(users)) {
        throw new DataCorruptionError(STORAGE_KEYS.USERS);
      }

      return users;
    } catch (error) {
      if (error instanceof DataCorruptionError) {
        throw error;
      }
      throw new LocalStorageError(
        'Failed to get all users',
        'GET_ALL_USERS_ERROR'
      );
    }
  }

  async updateUser(user: User): Promise<void> {
    await this.saveUser(user);
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const filteredUsers = users.filter((user) => user.id !== id);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
    } catch (error) {
      throw new LocalStorageError('Failed to delete user', 'DELETE_USER_ERROR');
    }
  }

  // Session Storage
  async saveSession(session: AuthSession): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'QuotaExceededError'
      ) {
        throw new QuotaExceededError();
      }
      throw new LocalStorageError(
        'Failed to save session',
        'SAVE_SESSION_ERROR'
      );
    }
  }

  async getSession(): Promise<AuthSession | null> {
    try {
      const sessionJson = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!sessionJson) return null;

      const session = JSON.parse(sessionJson);
      if (!session || typeof session !== 'object') {
        throw new DataCorruptionError(STORAGE_KEYS.SESSION);
      }

      return session;
    } catch (error) {
      if (error instanceof DataCorruptionError) {
        throw error;
      }
      throw new LocalStorageError('Failed to get session', 'GET_SESSION_ERROR');
    }
  }

  async clearSession(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (error) {
      throw new LocalStorageError(
        'Failed to clear session',
        'CLEAR_SESSION_ERROR'
      );
    }
  }

  // Attempt Logging
  async logRegistrationAttempt(attempt: RegistrationAttempt): Promise<void> {
    try {
      const attempts = await this.getRegistrationAttempts();
      attempts.push(attempt);

      // Keep only the last MAX_ATTEMPTS attempts
      if (attempts.length > STORAGE_LIMITS.MAX_ATTEMPTS) {
        attempts.splice(0, attempts.length - STORAGE_LIMITS.MAX_ATTEMPTS);
      }

      localStorage.setItem(
        STORAGE_KEYS.REGISTRATION_ATTEMPTS,
        JSON.stringify(attempts)
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'QuotaExceededError'
      ) {
        // Clear old attempts and try again
        await this.clearAll();
        await this.logRegistrationAttempt(attempt);
      } else {
        throw new LocalStorageError(
          'Failed to log registration attempt',
          'LOG_REGISTRATION_ATTEMPT_ERROR'
        );
      }
    }
  }

  async logLoginAttempt(attempt: LoginAttempt): Promise<void> {
    try {
      const attempts = await this.getLoginAttempts();
      attempts.push(attempt);

      // Keep only the last MAX_ATTEMPTS attempts
      if (attempts.length > STORAGE_LIMITS.MAX_ATTEMPTS) {
        attempts.splice(0, attempts.length - STORAGE_LIMITS.MAX_ATTEMPTS);
      }

      localStorage.setItem(
        STORAGE_KEYS.LOGIN_ATTEMPTS,
        JSON.stringify(attempts)
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === 'QuotaExceededError'
      ) {
        // Clear old attempts and try again
        await this.clearAll();
        await this.logLoginAttempt(attempt);
      } else {
        throw new LocalStorageError(
          'Failed to log login attempt',
          'LOG_LOGIN_ATTEMPT_ERROR'
        );
      }
    }
  }

  async getRegistrationAttempts(): Promise<RegistrationAttempt[]> {
    try {
      const attemptsJson = localStorage.getItem(
        STORAGE_KEYS.REGISTRATION_ATTEMPTS
      );
      if (!attemptsJson) return [];

      const attempts = JSON.parse(attemptsJson);
      if (!Array.isArray(attempts)) {
        throw new DataCorruptionError(STORAGE_KEYS.REGISTRATION_ATTEMPTS);
      }

      return attempts;
    } catch (error) {
      if (error instanceof DataCorruptionError) {
        throw error;
      }
      throw new LocalStorageError(
        'Failed to get registration attempts',
        'GET_REGISTRATION_ATTEMPTS_ERROR'
      );
    }
  }

  async getLoginAttempts(): Promise<LoginAttempt[]> {
    try {
      const attemptsJson = localStorage.getItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
      if (!attemptsJson) return [];

      const attempts = JSON.parse(attemptsJson);
      if (!Array.isArray(attempts)) {
        throw new DataCorruptionError(STORAGE_KEYS.LOGIN_ATTEMPTS);
      }

      return attempts;
    } catch (error) {
      if (error instanceof DataCorruptionError) {
        throw error;
      }
      throw new LocalStorageError(
        'Failed to get login attempts',
        'GET_LOGIN_ATTEMPTS_ERROR'
      );
    }
  }

  // Utility Methods
  async clearAll(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      localStorage.removeItem(STORAGE_KEYS.REGISTRATION_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEYS.LOGIN_ATTEMPTS);
    } catch (error) {
      throw new LocalStorageError(
        'Failed to clear all data',
        'CLEAR_ALL_ERROR'
      );
    }
  }

  isAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getStorageSize(): number {
    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch {
      return 0;
    }
  }
}

// Export singleton instance
export const localStorageService = new LocalStorageServiceImpl();
