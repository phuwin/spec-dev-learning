/**
 * Validation utilities
 * Implements validation logic based on contracts/validation-service.ts
 */

import type {
  ValidationService,
  ValidationResult,
  FormValidationResult,
} from '../types/validation';
import { VALIDATION_RULES, VALIDATION_ERRORS } from '../types/validation';

export class ValidationServiceImpl implements ValidationService {
  validateEmail(email: string): ValidationResult {
    if (!email || email.trim().length === 0) {
      return {
        isValid: false,
        error: VALIDATION_ERRORS.EMAIL_REQUIRED,
      };
    }

    if (email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
      return {
        isValid: false,
        error: VALIDATION_ERRORS.EMAIL_TOO_LONG,
      };
    }

    if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
      return {
        isValid: false,
        error: VALIDATION_ERRORS.EMAIL_INVALID_FORMAT,
      };
    }

    return { isValid: true };
  }

  validatePassword(password: string): ValidationResult {
    if (!password || password.trim().length === 0) {
      return {
        isValid: false,
        error: VALIDATION_ERRORS.PASSWORD_REQUIRED,
      };
    }

    if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
      return {
        isValid: false,
        error: VALIDATION_ERRORS.PASSWORD_TOO_LONG,
      };
    }

    return { isValid: true };
  }

  validateRegistrationForm(
    email: string,
    password: string
  ): FormValidationResult {
    const emailResult = this.validateEmail(email);
    const passwordResult = this.validatePassword(password);

    const errors: { email?: string; password?: string } = {};

    if (!emailResult.isValid) {
      errors.email = emailResult.error;
    }

    if (!passwordResult.isValid) {
      errors.password = passwordResult.error;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateLoginForm(email: string, password: string): FormValidationResult {
    const emailResult = this.validateEmail(email);
    const passwordResult = this.validatePassword(password);

    const errors: { email?: string; password?: string } = {};

    if (!emailResult.isValid) {
      errors.email = emailResult.error;
    }

    if (!passwordResult.isValid) {
      errors.password = passwordResult.error;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  sanitizeInput(input: string): string {
    return input.trim();
  }

  isEmailFormat(email: string): boolean {
    return VALIDATION_RULES.EMAIL.PATTERN.test(email);
  }

  isPasswordEmpty(password: string): boolean {
    return !password || password.trim().length === 0;
  }
}

// Export singleton instance
export const validationService = new ValidationServiceImpl();
