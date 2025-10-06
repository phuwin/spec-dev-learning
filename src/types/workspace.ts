/**
 * Workspace Types
 * TypeScript interfaces for workspace management
 */

export interface Workspace {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceAdmin {
  workspaceId: string;
  userId: string;
  permissions: string[];
  assignedAt: Date;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
}

export interface WorkspaceValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    description?: string;
  };
}

export interface WorkspaceListFilters {
  search?: string;
  creatorId?: string;
}

export interface WorkspaceListResult {
  workspaces: Workspace[];
  total: number;
  hasMore: boolean;
}
