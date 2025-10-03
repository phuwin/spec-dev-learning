/**
 * Authentication Service Implementation
 * Frontend-only MVP using localStorage for persistence
 */

import type {
  AuthService,
  RegistrationResult,
  LoginResult,
} from '../types/auth';
import {
  AuthError,
  ValidationError,
  DuplicateEmailError,
  InvalidCredentialsError,
  UserNotFoundError,
} from '../types/auth';
import type {
  User,
  UserAccount,
  AuthSession,
  RegistrationAttempt,
  LoginAttempt,
} from '../types/user';
import { localStorageService } from './localStorageService';
import { validationService } from '../utils/validation';
import { generateUUID } from '../utils/uuid';

export class AuthServiceImpl implements AuthService {
  // User Registration
  async register(email: string, password: string): Promise<RegistrationResult> {
    try {
      // Validate input
      const validation = validationService.validateRegistrationForm(
        email,
        password
      );
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        throw new ValidationError(errorMessage);
      }

      // Check if user already exists
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new DuplicateEmailError(email);
      }

      // Create new user
      const userAccount: UserAccount = {
        id: generateUUID(),
        email: email.trim().toLowerCase(),
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
      };

      // Save user to localStorage
      await localStorageService.saveUser(userAccount);

      // Create session
      const session: AuthSession = {
        userId: userAccount.id,
        email: userAccount.email,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };

      await localStorageService.saveSession(session);

      // Log successful registration attempt
      const attempt: RegistrationAttempt = {
        email: userAccount.email,
        timestamp: new Date().toISOString(),
        success: true,
      };
      await localStorageService.logRegistrationAttempt(attempt);

      // Return public user data
      const publicUser: User = {
        id: userAccount.id,
        email: userAccount.email,
        createdAt: userAccount.createdAt,
      };

      return {
        success: true,
        user: publicUser,
      };
    } catch (error) {
      // Log failed registration attempt
      const attempt: RegistrationAttempt = {
        email: email,
        timestamp: new Date().toISOString(),
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
      await localStorageService.logRegistrationAttempt(attempt);

      if (error instanceof AuthError) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  }

  // User Login
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      // Validate input
      const validation = validationService.validateLoginForm(email, password);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        throw new ValidationError(errorMessage);
      }

      // Find user by email
      const userAccount = await this.getUserAccountByEmail(email);
      if (!userAccount) {
        throw new UserNotFoundError(email);
      }

      // Check password (in production, this should use proper hashing)
      if (userAccount.password !== password) {
        throw new InvalidCredentialsError();
      }

      // Update last login
      await this.updateLastLogin(userAccount.id);

      // Create session
      const session: AuthSession = {
        userId: userAccount.id,
        email: userAccount.email,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };

      await localStorageService.saveSession(session);

      // Log successful login attempt
      const attempt: LoginAttempt = {
        email: userAccount.email,
        timestamp: new Date().toISOString(),
        success: true,
      };
      await localStorageService.logLoginAttempt(attempt);

      // Return public user data
      const publicUser: User = {
        id: userAccount.id,
        email: userAccount.email,
        createdAt: userAccount.createdAt,
        lastLoginAt: userAccount.lastLoginAt,
      };

      return {
        success: true,
        user: publicUser,
      };
    } catch (error) {
      // Log failed login attempt
      const attempt: LoginAttempt = {
        email: email,
        timestamp: new Date().toISOString(),
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
      await localStorageService.logLoginAttempt(attempt);

      if (error instanceof AuthError) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    }
  }

  // User Logout
  async logout(): Promise<void> {
    try {
      await localStorageService.clearSession();
    } catch (error) {
      // Log error but don't throw - logout should always succeed
      console.error('Error during logout:', error);
    }
  }

  // Session Management
  async getCurrentUser(): Promise<User | null> {
    try {
      const session = await localStorageService.getSession();
      if (!session || !session.isActive) {
        return null;
      }

      const userAccount = await localStorageService.getUser(session.userId);
      if (!userAccount) {
        return null;
      }

      return {
        id: userAccount.id,
        email: userAccount.email,
        createdAt: userAccount.createdAt,
        lastLoginAt: userAccount.lastLoginAt,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const session = await localStorageService.getSession();
      return !!(session && session.isActive);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  // User Management
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userAccount = await this.getUserAccountByEmail(email);
      if (!userAccount) {
        return null;
      }

      return {
        id: userAccount.id,
        email: userAccount.email,
        createdAt: userAccount.createdAt,
        lastLoginAt: userAccount.lastLoginAt,
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      const userAccount = await localStorageService.getUser(userId);
      if (userAccount) {
        userAccount.lastLoginAt = new Date().toISOString();
        await localStorageService.updateUser(userAccount);
      }
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  // Private helper methods
  private async getUserAccountByEmail(
    email: string
  ): Promise<UserAccount | null> {
    const users = await localStorageService.getAllUsers();
    return (
      users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ||
      null
    );
  }
}

// Export singleton instance
export const authService = new AuthServiceImpl();
