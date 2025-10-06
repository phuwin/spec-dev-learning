/**
 * Workspace Service Contract
 * Defines the interface for workspace management operations
 */

export interface Workspace {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
}

export interface WorkspaceService {
  /**
   * Create a new workspace
   * @param request - Workspace creation data
   * @param creatorId - ID of the user creating the workspace
   * @returns Promise<Workspace> - Created workspace
   * @throws ValidationError - If name is empty or already exists
   */
  createWorkspace(
    request: CreateWorkspaceRequest,
    creatorId: string
  ): Promise<Workspace>;

  /**
   * Get all workspaces for a user
   * @param userId - ID of the user
   * @returns Promise<Workspace[]> - List of user's workspaces
   */
  getUserWorkspaces(userId: string): Promise<Workspace[]>;

  /**
   * Get workspace by ID
   * @param workspaceId - ID of the workspace
   * @returns Promise<Workspace | null> - Workspace or null if not found
   */
  getWorkspace(workspaceId: string): Promise<Workspace | null>;

  /**
   * Update workspace settings (admin only)
   * @param workspaceId - ID of the workspace
   * @param request - Update data
   * @param userId - ID of the user making the request
   * @returns Promise<Workspace> - Updated workspace
   * @throws ValidationError - If name is empty or already exists
   * @throws AuthorizationError - If user is not workspace admin
   */
  updateWorkspace(
    workspaceId: string,
    request: UpdateWorkspaceRequest,
    userId: string
  ): Promise<Workspace>;

  /**
   * Delete workspace (admin only)
   * @param workspaceId - ID of the workspace
   * @param userId - ID of the user making the request
   * @returns Promise<void>
   * @throws AuthorizationError - If user is not workspace admin
   */
  deleteWorkspace(workspaceId: string, userId: string): Promise<void>;

  /**
   * Check if workspace name is available
   * @param name - Workspace name to check
   * @returns Promise<boolean> - True if name is available
   */
  isWorkspaceNameAvailable(name: string): Promise<boolean>;

  /**
   * Check if user is workspace admin
   * @param workspaceId - ID of the workspace
   * @param userId - ID of the user
   * @returns Promise<boolean> - True if user is admin
   */
  isWorkspaceAdmin(workspaceId: string, userId: string): Promise<boolean>;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
