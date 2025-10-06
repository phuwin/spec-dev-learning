/**
 * Workspace Service Contract Tests
 * Tests the workspace service interface contract
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type {
  WorkspaceService,
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '../../src/types/workspace';

// Mock implementation for testing
class MockWorkspaceService implements WorkspaceService {
  private workspaces: Workspace[] = [];
  private workspaceAdmins: Map<string, string[]> = new Map();

  async createWorkspace(
    request: CreateWorkspaceRequest,
    creatorId: string
  ): Promise<Workspace> {
    const workspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name: request.name,
      description: request.description || '',
      creatorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.workspaces.push(workspace);
    this.workspaceAdmins.set(workspace.id, [creatorId]);

    return workspace;
  }

  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    return this.workspaces.filter((w) => w.creatorId === userId);
  }

  async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    return this.workspaces.find((w) => w.id === workspaceId) || null;
  }

  async updateWorkspace(
    workspaceId: string,
    request: UpdateWorkspaceRequest,
    userId: string
  ): Promise<Workspace> {
    const workspace = this.workspaces.find((w) => w.id === workspaceId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    if (request.name !== undefined) {
      workspace.name = request.name;
    }
    if (request.description !== undefined) {
      workspace.description = request.description;
    }
    workspace.updatedAt = new Date();

    return workspace;
  }

  async deleteWorkspace(workspaceId: string, userId: string): Promise<void> {
    const index = this.workspaces.findIndex((w) => w.id === workspaceId);
    if (index === -1) {
      throw new Error('Workspace not found');
    }
    this.workspaces.splice(index, 1);
  }

  async isWorkspaceNameAvailable(name: string): Promise<boolean> {
    return !this.workspaces.some((w) => w.name === name);
  }

  async isWorkspaceAdmin(
    workspaceId: string,
    userId: string
  ): Promise<boolean> {
    const admins = this.workspaceAdmins.get(workspaceId) || [];
    return admins.includes(userId);
  }
}

describe('WorkspaceService Contract', () => {
  let service: WorkspaceService;
  let mockUserId: string;

  beforeEach(() => {
    service = new MockWorkspaceService();
    mockUserId = 'user-123';
  });

  describe('createWorkspace', () => {
    it('should create a workspace with valid data', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const workspace = await service.createWorkspace(request, mockUserId);

      expect(workspace).toBeDefined();
      expect(workspace.name).toBe(request.name);
      expect(workspace.description).toBe(request.description);
      expect(workspace.creatorId).toBe(mockUserId);
      expect(workspace.id).toBeDefined();
      expect(workspace.createdAt).toBeInstanceOf(Date);
      expect(workspace.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a workspace without description', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
      };

      const workspace = await service.createWorkspace(request, mockUserId);

      expect(workspace.description).toBe('');
    });

    it('should throw error for empty workspace name', async () => {
      const request: CreateWorkspaceRequest = {
        name: '',
        description: 'A test workspace',
      };

      await expect(
        service.createWorkspace(request, mockUserId)
      ).rejects.toThrow();
    });
  });

  describe('getUserWorkspaces', () => {
    it('should return empty array for user with no workspaces', async () => {
      const workspaces = await service.getUserWorkspaces(mockUserId);
      expect(workspaces).toEqual([]);
    });

    it('should return user workspaces', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      await service.createWorkspace(request, mockUserId);
      const workspaces = await service.getUserWorkspaces(mockUserId);

      expect(workspaces).toHaveLength(1);
      expect(workspaces[0].name).toBe(request.name);
    });
  });

  describe('getWorkspace', () => {
    it('should return null for non-existent workspace', async () => {
      const workspace = await service.getWorkspace('non-existent');
      expect(workspace).toBeNull();
    });

    it('should return workspace by id', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await service.createWorkspace(request, mockUserId);
      const retrieved = await service.getWorkspace(created.id);

      expect(retrieved).toEqual(created);
    });
  });

  describe('updateWorkspace', () => {
    it('should update workspace name', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await service.createWorkspace(request, mockUserId);
      const updateRequest: UpdateWorkspaceRequest = {
        name: 'Updated Workspace',
      };

      const updated = await service.updateWorkspace(
        created.id,
        updateRequest,
        mockUserId
      );

      expect(updated.name).toBe('Updated Workspace');
      expect(updated.description).toBe(request.description);
    });

    it('should update workspace description', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await service.createWorkspace(request, mockUserId);
      const updateRequest: UpdateWorkspaceRequest = {
        description: 'Updated description',
      };

      const updated = await service.updateWorkspace(
        created.id,
        updateRequest,
        mockUserId
      );

      expect(updated.description).toBe('Updated description');
      expect(updated.name).toBe(request.name);
    });
  });

  describe('deleteWorkspace', () => {
    it('should delete workspace', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await service.createWorkspace(request, mockUserId);
      await service.deleteWorkspace(created.id, mockUserId);

      const retrieved = await service.getWorkspace(created.id);
      expect(retrieved).toBeNull();
    });
  });

  describe('isWorkspaceNameAvailable', () => {
    it('should return true for available name', async () => {
      const available =
        await service.isWorkspaceNameAvailable('Available Name');
      expect(available).toBe(true);
    });

    it('should return false for existing name', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      await service.createWorkspace(request, mockUserId);
      const available =
        await service.isWorkspaceNameAvailable('Test Workspace');
      expect(available).toBe(false);
    });
  });

  describe('isWorkspaceAdmin', () => {
    it('should return true for workspace creator', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await service.createWorkspace(request, mockUserId);
      const isAdmin = await service.isWorkspaceAdmin(created.id, mockUserId);
      expect(isAdmin).toBe(true);
    });

    it('should return false for non-admin user', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await service.createWorkspace(request, mockUserId);
      const isAdmin = await service.isWorkspaceAdmin(created.id, 'other-user');
      expect(isAdmin).toBe(false);
    });
  });
});
