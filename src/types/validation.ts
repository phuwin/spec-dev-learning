/**
 * Validation-related type definitions
 * Based on contracts/validation-service.ts specifications
 */

export interface ValidationService {
  // Email Validation
  validateEmail(email: string): ValidationResult;

  // Password Validation
  validatePassword(password: string): ValidationResult;

  // Form Validation
  validateRegistrationForm(
    email: string,
    password: string
  ): FormValidationResult;
  validateLoginForm(email: string, password: string): FormValidationResult;

  // Utility Methods
  sanitizeInput(input: string): string;
  isEmailFormat(email: string): boolean;
  isPasswordEmpty(password: string): boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
}

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 254,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
} as const;

// Error Messages
export const VALIDATION_ERRORS = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID_FORMAT: 'Please enter a valid email address',
  EMAIL_TOO_LONG: 'Email address is too long',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_LONG: 'Password is too long',
  FORM_INVALID: 'Please fix the errors above',
} as const;

// Re-export all interfaces for convenience
export type { ValidationService, ValidationResult, FormValidationResult };
