/**
 * Workspace Service Error Classes
 * Custom error classes for workspace operations
 */

/**
 * Base error class for workspace operations
 */
export abstract class WorkspaceError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when workspace validation fails
 */
export class WorkspaceValidationError extends WorkspaceError {
  readonly code = 'WORKSPACE_VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}

/**
 * Error thrown when workspace name already exists
 */
export class WorkspaceNameExistsError extends WorkspaceError {
  readonly code = 'WORKSPACE_NAME_EXISTS';
  readonly statusCode = 409;

  constructor(workspaceName: string) {
    super(`Workspace name "${workspaceName}" already exists`, {
      workspaceName,
    });
  }
}

/**
 * Error thrown when workspace is not found
 */
export class WorkspaceNotFoundError extends WorkspaceError {
  readonly code = 'WORKSPACE_NOT_FOUND';
  readonly statusCode = 404;

  constructor(workspaceId: string) {
    super(`Workspace with ID "${workspaceId}" not found`, { workspaceId });
  }
}

/**
 * Error thrown when user is not authorized to perform workspace operation
 */
export class WorkspaceAuthorizationError extends WorkspaceError {
  readonly code = 'WORKSPACE_AUTHORIZATION_ERROR';
  readonly statusCode = 403;

  constructor(operation: string, workspaceId: string, userId: string) {
    super(
      `User "${userId}" is not authorized to ${operation} workspace "${workspaceId}"`,
      { operation, workspaceId, userId }
    );
  }
}

/**
 * Error thrown when workspace creation fails due to system error
 */
export class WorkspaceCreationError extends WorkspaceError {
  readonly code = 'WORKSPACE_CREATION_ERROR';
  readonly statusCode = 500;

  constructor(originalError?: Error) {
    super(
      'Failed to create workspace due to system error',
      originalError ? { originalError: originalError.message } : undefined
    );
  }
}

/**
 * Error thrown when workspace update fails due to system error
 */
export class WorkspaceUpdateError extends WorkspaceError {
  readonly code = 'WORKSPACE_UPDATE_ERROR';
  readonly statusCode = 500;

  constructor(workspaceId: string, originalError?: Error) {
    super(`Failed to update workspace "${workspaceId}" due to system error`, {
      workspaceId,
      originalError: originalError?.message,
    });
  }
}

/**
 * Error thrown when workspace deletion fails due to system error
 */
export class WorkspaceDeletionError extends WorkspaceError {
  readonly code = 'WORKSPACE_DELETION_ERROR';
  readonly statusCode = 500;

  constructor(workspaceId: string, originalError?: Error) {
    super(`Failed to delete workspace "${workspaceId}" due to system error`, {
      workspaceId,
      originalError: originalError?.message,
    });
  }
}

/**
 * Error thrown when workspace name is invalid
 */
export class InvalidWorkspaceNameError extends WorkspaceError {
  readonly code = 'INVALID_WORKSPACE_NAME';
  readonly statusCode = 400;

  constructor(workspaceName: string, reason: string) {
    super(`Invalid workspace name "${workspaceName}": ${reason}`, {
      workspaceName,
      reason,
    });
  }
}

/**
 * Error thrown when workspace description is invalid
 */
export class InvalidWorkspaceDescriptionError extends WorkspaceError {
  readonly code = 'INVALID_WORKSPACE_DESCRIPTION';
  readonly statusCode = 400;

  constructor(reason: string) {
    super(`Invalid workspace description: ${reason}`, { reason });
  }
}

/**
 * Error thrown when concurrent workspace creation attempts conflict
 */
export class WorkspaceConcurrencyError extends WorkspaceError {
  readonly code = 'WORKSPACE_CONCURRENCY_ERROR';
  readonly statusCode = 409;

  constructor(workspaceName: string) {
    super(
      `Concurrent creation attempt detected for workspace "${workspaceName}". Please try again.`,
      { workspaceName }
    );
  }
}

/**
 * Helper function to check if an error is a workspace error
 */
export function isWorkspaceError(error: unknown): error is WorkspaceError {
  return error instanceof WorkspaceError;
}

/**
 * Helper function to get user-friendly error message
 */
export function getWorkspaceErrorMessage(error: unknown): string {
  if (isWorkspaceError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Helper function to get error code
 */
export function getWorkspaceErrorCode(error: unknown): string {
  if (isWorkspaceError(error)) {
    return error.code;
  }

  return 'UNKNOWN_ERROR';
}
