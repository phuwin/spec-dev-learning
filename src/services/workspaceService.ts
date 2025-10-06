/**
 * Workspace Service Implementation
 * Service for managing workspace operations with local storage backend
 */

import type {
  Workspace,
  WorkspaceAdmin,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceListResult,
  WorkspaceListFilters,
} from '../types/workspace';
import {
  WorkspaceValidationError,
  WorkspaceNameExistsError,
  WorkspaceNotFoundError,
  WorkspaceAuthorizationError,
  WorkspaceCreationError,
  WorkspaceUpdateError,
  WorkspaceDeletionError,
  InvalidWorkspaceNameError,
  InvalidWorkspaceDescriptionError,
  WorkspaceConcurrencyError,
} from './workspaceErrors';
import {
  validateCreateWorkspaceRequest,
  validateUpdateWorkspaceRequest,
  isWorkspaceNameAvailable,
  sanitizeWorkspaceName,
  sanitizeWorkspaceDescription,
} from '../utils/workspaceValidation';
import { generateUUID } from '../utils/uuid';

// Storage keys
const WORKSPACES_KEY = 'workspaces';
const WORKSPACE_NAMES_KEY = 'workspace_names';
const WORKSPACE_ADMINS_KEY = 'workspace_admins';

// Concurrency control
const creationLocks = new Map<string, Promise<Workspace>>();

export class WorkspaceServiceImpl {
  // Create a new workspace
  async createWorkspace(
    request: CreateWorkspaceRequest,
    creatorId: string
  ): Promise<Workspace> {
    try {
      // Validate request
      const validation = validateCreateWorkspaceRequest(request);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        throw new WorkspaceValidationError(errorMessage, validation.errors);
      }

      // Sanitize input
      const sanitizedName = sanitizeWorkspaceName(request.name);
      const sanitizedDescription = sanitizeWorkspaceDescription(
        request.description
      );

      // Check for concurrent creation attempts
      const lockKey = `create:${sanitizedName}`;
      if (creationLocks.has(lockKey)) {
        throw new WorkspaceConcurrencyError(sanitizedName);
      }

      // Create lock for this workspace name
      const creationPromise = this._createWorkspaceInternal(
        { ...request, name: sanitizedName, description: sanitizedDescription },
        creatorId
      );

      creationLocks.set(lockKey, creationPromise);

      try {
        const workspace = await creationPromise;
        return workspace;
      } finally {
        creationLocks.delete(lockKey);
      }
    } catch (error) {
      if (
        error instanceof WorkspaceValidationError ||
        error instanceof WorkspaceNameExistsError ||
        error instanceof WorkspaceConcurrencyError
      ) {
        throw error;
      }
      throw new WorkspaceCreationError(
        error instanceof Error ? error : undefined
      );
    }
  }

  // Internal method to create workspace
  private async _createWorkspaceInternal(
    request: CreateWorkspaceRequest,
    creatorId: string
  ): Promise<Workspace> {
    // Check if name is available
    const isAvailable = await this.isWorkspaceNameAvailable(request.name);
    if (!isAvailable) {
      throw new WorkspaceNameExistsError(request.name);
    }

    // Create workspace
    const workspace: Workspace = {
      id: generateUUID(),
      name: request.name,
      description: request.description || '',
      creatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create admin relationship
    const admin: WorkspaceAdmin = {
      workspaceId: workspace.id,
      userId: creatorId,
      permissions: ['manage_settings'],
      assignedAt: new Date(),
    };

    // Store in localStorage
    await this._storeWorkspace(workspace);
    await this._storeWorkspaceAdmin(admin);
    await this._addWorkspaceName(workspace.name);

    return workspace;
  }

  // Get all workspaces for a user
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    try {
      const workspaces = await this._getAllWorkspaces();
      return workspaces.filter((workspace) => workspace.creatorId === userId);
    } catch (error) {
      console.error('Error getting user workspaces:', error);
      return [];
    }
  }

  // Get workspace by ID
  async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    try {
      const workspaces = await this._getAllWorkspaces();
      return (
        workspaces.find((workspace) => workspace.id === workspaceId) || null
      );
    } catch (error) {
      console.error('Error getting workspace:', error);
      return null;
    }
  }

  // Update workspace settings (admin only)
  async updateWorkspace(
    workspaceId: string,
    request: UpdateWorkspaceRequest,
    userId: string
  ): Promise<Workspace> {
    try {
      // Check authorization
      const isAdmin = await this.isWorkspaceAdmin(workspaceId, userId);
      if (!isAdmin) {
        throw new WorkspaceAuthorizationError('update', workspaceId, userId);
      }

      // Validate request
      const validation = validateUpdateWorkspaceRequest(request);
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(', ');
        throw new WorkspaceValidationError(errorMessage, validation.errors);
      }

      // Get existing workspace
      const workspace = await this.getWorkspace(workspaceId);
      if (!workspace) {
        throw new WorkspaceNotFoundError(workspaceId);
      }

      // Check name availability if name is being updated
      if (request.name && request.name !== workspace.name) {
        const isAvailable = await this.isWorkspaceNameAvailable(request.name);
        if (!isAvailable) {
          throw new WorkspaceNameExistsError(request.name);
        }
      }

      // Update workspace
      const updatedWorkspace: Workspace = {
        ...workspace,
        name: request.name
          ? sanitizeWorkspaceName(request.name)
          : workspace.name,
        description:
          request.description !== undefined
            ? sanitizeWorkspaceDescription(request.description)
            : workspace.description,
        updatedAt: new Date(),
      };

      // Store updated workspace
      await this._storeWorkspace(updatedWorkspace);

      // Update workspace names index if name changed
      if (request.name && request.name !== workspace.name) {
        await this._removeWorkspaceName(workspace.name);
        await this._addWorkspaceName(updatedWorkspace.name);
      }

      return updatedWorkspace;
    } catch (error) {
      if (
        error instanceof WorkspaceAuthorizationError ||
        error instanceof WorkspaceNotFoundError ||
        error instanceof WorkspaceValidationError ||
        error instanceof WorkspaceNameExistsError
      ) {
        throw error;
      }
      throw new WorkspaceUpdateError(
        workspaceId,
        error instanceof Error ? error : undefined
      );
    }
  }

  // Delete workspace (admin only)
  async deleteWorkspace(workspaceId: string, userId: string): Promise<void> {
    try {
      // Check authorization
      const isAdmin = await this.isWorkspaceAdmin(workspaceId, userId);
      if (!isAdmin) {
        throw new WorkspaceAuthorizationError('delete', workspaceId, userId);
      }

      // Get workspace to get name for cleanup
      const workspace = await this.getWorkspace(workspaceId);
      if (!workspace) {
        throw new WorkspaceNotFoundError(workspaceId);
      }

      // Remove from localStorage
      await this._removeWorkspace(workspaceId);
      await this._removeWorkspaceAdmin(workspaceId);
      await this._removeWorkspaceName(workspace.name);
    } catch (error) {
      if (
        error instanceof WorkspaceAuthorizationError ||
        error instanceof WorkspaceNotFoundError
      ) {
        throw error;
      }
      throw new WorkspaceDeletionError(
        workspaceId,
        error instanceof Error ? error : undefined
      );
    }
  }

  // Check if workspace name is available
  async isWorkspaceNameAvailable(name: string): Promise<boolean> {
    try {
      const workspaceNames = await this._getWorkspaceNames();
      return isWorkspaceNameAvailable(name, workspaceNames);
    } catch (error) {
      console.error('Error checking workspace name availability:', error);
      return false;
    }
  }

  // Check if user is workspace admin
  async isWorkspaceAdmin(
    workspaceId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const admins = await this._getWorkspaceAdmins(workspaceId);
      return admins.includes(userId);
    } catch (error) {
      console.error('Error checking workspace admin status:', error);
      return false;
    }
  }

  // List workspaces with filters
  async listWorkspaces(
    filters: WorkspaceListFilters = {}
  ): Promise<WorkspaceListResult> {
    try {
      let workspaces = await this._getAllWorkspaces();

      // Apply filters
      if (filters.creatorId) {
        workspaces = workspaces.filter(
          (w) => w.creatorId === filters.creatorId
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        workspaces = workspaces.filter(
          (w) =>
            w.name.toLowerCase().includes(searchTerm) ||
            w.description.toLowerCase().includes(searchTerm)
        );
      }

      return {
        workspaces,
        total: workspaces.length,
        hasMore: false, // For MVP, we don't implement pagination
      };
    } catch (error) {
      console.error('Error listing workspaces:', error);
      return {
        workspaces: [],
        total: 0,
        hasMore: false,
      };
    }
  }

  // Private helper methods for localStorage operations
  private async _getAllWorkspaces(): Promise<Workspace[]> {
    try {
      const data = localStorage.getItem(WORKSPACES_KEY);
      if (!data) return [];

      const workspaces = JSON.parse(data);
      return workspaces.map((w: any) => ({
        ...w,
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting workspaces from localStorage:', error);
      return [];
    }
  }

  private async _storeWorkspace(workspace: Workspace): Promise<void> {
    try {
      const workspaces = await this._getAllWorkspaces();
      const index = workspaces.findIndex((w) => w.id === workspace.id);

      if (index >= 0) {
        workspaces[index] = workspace;
      } else {
        workspaces.push(workspace);
      }

      localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
    } catch (error) {
      console.error('Error storing workspace:', error);
      throw error;
    }
  }

  private async _removeWorkspace(workspaceId: string): Promise<void> {
    try {
      const workspaces = await this._getAllWorkspaces();
      const filtered = workspaces.filter((w) => w.id !== workspaceId);
      localStorage.setItem(WORKSPACES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing workspace:', error);
      throw error;
    }
  }

  private async _getWorkspaceNames(): Promise<string[]> {
    try {
      const data = localStorage.getItem(WORKSPACE_NAMES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting workspace names:', error);
      return [];
    }
  }

  private async _addWorkspaceName(name: string): Promise<void> {
    try {
      const names = await this._getWorkspaceNames();
      if (!names.includes(name)) {
        names.push(name);
        localStorage.setItem(WORKSPACE_NAMES_KEY, JSON.stringify(names));
      }
    } catch (error) {
      console.error('Error adding workspace name:', error);
      throw error;
    }
  }

  private async _removeWorkspaceName(name: string): Promise<void> {
    try {
      const names = await this._getWorkspaceNames();
      const filtered = names.filter((n) => n !== name);
      localStorage.setItem(WORKSPACE_NAMES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing workspace name:', error);
      throw error;
    }
  }

  private async _getWorkspaceAdmins(workspaceId: string): Promise<string[]> {
    try {
      const data = localStorage.getItem(
        `${WORKSPACE_ADMINS_KEY}:${workspaceId}`
      );
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting workspace admins:', error);
      return [];
    }
  }

  private async _storeWorkspaceAdmin(admin: WorkspaceAdmin): Promise<void> {
    try {
      const admins = await this._getWorkspaceAdmins(admin.workspaceId);
      if (!admins.includes(admin.userId)) {
        admins.push(admin.userId);
        localStorage.setItem(
          `${WORKSPACE_ADMINS_KEY}:${admin.workspaceId}`,
          JSON.stringify(admins)
        );
      }
    } catch (error) {
      console.error('Error storing workspace admin:', error);
      throw error;
    }
  }

  private async _removeWorkspaceAdmin(workspaceId: string): Promise<void> {
    try {
      localStorage.removeItem(`${WORKSPACE_ADMINS_KEY}:${workspaceId}`);
    } catch (error) {
      console.error('Error removing workspace admin:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const workspaceService = new WorkspaceServiceImpl();
