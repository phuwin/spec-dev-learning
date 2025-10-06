/**
 * Workspace Validation Utilities
 * Validation functions for workspace data
 */

import type {
  WorkspaceValidationResult,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '../types/workspace';

/**
 * Validates workspace name
 * @param name - Workspace name to validate
 * @returns Validation result with error message if invalid
 */
export function validateWorkspaceName(name: string): {
  isValid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Workspace name is required' };
  }

  if (name.trim().length < 1) {
    return { isValid: false, error: 'Workspace name cannot be empty' };
  }

  if (name.length > 100) {
    return {
      isValid: false,
      error: 'Workspace name must be 100 characters or less',
    };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return {
      isValid: false,
      error: 'Workspace name contains invalid characters',
    };
  }

  return { isValid: true };
}

/**
 * Validates workspace description
 * @param description - Workspace description to validate
 * @returns Validation result with error message if invalid
 */
export function validateWorkspaceDescription(description?: string): {
  isValid: boolean;
  error?: string;
} {
  if (!description) {
    return { isValid: true }; // Description is optional
  }

  if (description.length > 500) {
    return {
      isValid: false,
      error: 'Workspace description must be 500 characters or less',
    };
  }

  return { isValid: true };
}

/**
 * Validates a complete workspace creation request
 * @param request - Workspace creation request
 * @returns Complete validation result
 */
export function validateCreateWorkspaceRequest(
  request: CreateWorkspaceRequest
): WorkspaceValidationResult {
  const errors: { name?: string; description?: string } = {};

  // Validate name
  const nameValidation = validateWorkspaceName(request.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }

  // Validate description
  const descriptionValidation = validateWorkspaceDescription(
    request.description
  );
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates a workspace update request
 * @param request - Workspace update request
 * @returns Complete validation result
 */
export function validateUpdateWorkspaceRequest(
  request: UpdateWorkspaceRequest
): WorkspaceValidationResult {
  const errors: { name?: string; description?: string } = {};

  // Validate name if provided
  if (request.name !== undefined) {
    const nameValidation = validateWorkspaceName(request.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.error;
    }
  }

  // Validate description if provided
  if (request.description !== undefined) {
    const descriptionValidation = validateWorkspaceDescription(
      request.description
    );
    if (!descriptionValidation.isValid) {
      errors.description = descriptionValidation.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Checks if a workspace name is available (not already in use)
 * @param name - Workspace name to check
 * @param existingNames - Array of existing workspace names
 * @returns True if name is available
 */
export function isWorkspaceNameAvailable(
  name: string,
  existingNames: string[]
): boolean {
  const normalizedName = name.trim().toLowerCase();
  return !existingNames.some(
    (existing) => existing.trim().toLowerCase() === normalizedName
  );
}

/**
 * Sanitizes workspace name by trimming and normalizing
 * @param name - Raw workspace name
 * @returns Sanitized workspace name
 */
export function sanitizeWorkspaceName(name: string): string {
  return name.trim();
}

/**
 * Sanitizes workspace description by trimming
 * @param description - Raw workspace description
 * @returns Sanitized workspace description
 */
export function sanitizeWorkspaceDescription(description?: string): string {
  return description ? description.trim() : '';
}
