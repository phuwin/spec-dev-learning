/**
 * Workspace Service Contract Tests
 * These tests define the expected behavior of the workspace service
 * Tests should FAIL initially (no implementation exists)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import type {
  WorkspaceService,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from './workspace-service';

// Mock implementation for testing (will be replaced with real implementation)
const createMockWorkspaceService = (): WorkspaceService => {
  throw new Error('WorkspaceService not implemented yet');
};

describe('WorkspaceService Contract Tests', () => {
  let workspaceService: WorkspaceService;
  const mockUserId = 'user-123';
  const mockWorkspaceId = 'workspace-456';

  beforeEach(() => {
    workspaceService = createMockWorkspaceService();
  });

  describe('createWorkspace', () => {
    it('should create a workspace with valid data', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'My Workspace',
        description: 'A test workspace',
      };

      const workspace = await workspaceService.createWorkspace(
        request,
        mockUserId
      );

      expect(workspace).toBeDefined();
      expect(workspace.name).toBe('My Workspace');
      expect(workspace.description).toBe('A test workspace');
      expect(workspace.creatorId).toBe(mockUserId);
      expect(workspace.id).toBeDefined();
      expect(workspace.createdAt).toBeInstanceOf(Date);
    });

    it('should create a workspace without description', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Simple Workspace',
      };

      const workspace = await workspaceService.createWorkspace(
        request,
        mockUserId
      );

      expect(workspace.name).toBe('Simple Workspace');
      expect(workspace.description).toBe('');
    });

    it('should throw ValidationError for empty name', async () => {
      const request: CreateWorkspaceRequest = {
        name: '',
        description: 'Test',
      };

      await expect(
        workspaceService.createWorkspace(request, mockUserId)
      ).rejects.toThrow('ValidationError');
    });

    it('should throw ValidationError for duplicate name', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Existing Workspace',
        description: 'Test',
      };

      // First creation should succeed
      await workspaceService.createWorkspace(request, mockUserId);

      // Second creation with same name should fail
      await expect(
        workspaceService.createWorkspace(request, 'user-456')
      ).rejects.toThrow('ValidationError');
    });
  });

  describe('getUserWorkspaces', () => {
    it('should return empty array for user with no workspaces', async () => {
      const workspaces =
        await workspaceService.getUserWorkspaces('user-no-workspaces');
      expect(workspaces).toEqual([]);
    });

    it('should return user workspaces', async () => {
      // Create a workspace first
      await workspaceService.createWorkspace(
        {
          name: 'User Workspace',
          description: 'Test',
        },
        mockUserId
      );

      const workspaces = await workspaceService.getUserWorkspaces(mockUserId);
      expect(workspaces).toHaveLength(1);
      expect(workspaces[0].name).toBe('User Workspace');
    });
  });

  describe('getWorkspace', () => {
    it('should return workspace by ID', async () => {
      const created = await workspaceService.createWorkspace(
        {
          name: 'Test Workspace',
          description: 'Test',
        },
        mockUserId
      );

      const workspace = await workspaceService.getWorkspace(created.id);
      expect(workspace).toBeDefined();
      expect(workspace?.id).toBe(created.id);
    });

    it('should return null for non-existent workspace', async () => {
      const workspace = await workspaceService.getWorkspace('non-existent');
      expect(workspace).toBeNull();
    });
  });

  describe('updateWorkspace', () => {
    it('should update workspace name and description', async () => {
      const created = await workspaceService.createWorkspace(
        {
          name: 'Original Name',
          description: 'Original Description',
        },
        mockUserId
      );

      const updateRequest: UpdateWorkspaceRequest = {
        name: 'Updated Name',
        description: 'Updated Description',
      };

      const updated = await workspaceService.updateWorkspace(
        created.id,
        updateRequest,
        mockUserId
      );

      expect(updated.name).toBe('Updated Name');
      expect(updated.description).toBe('Updated Description');
      expect(updated.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw AuthorizationError for non-admin user', async () => {
      const created = await workspaceService.createWorkspace(
        {
          name: 'Test Workspace',
          description: 'Test',
        },
        mockUserId
      );

      await expect(
        workspaceService.updateWorkspace(
          created.id,
          { name: 'Hacked Name' },
          'other-user'
        )
      ).rejects.toThrow('AuthorizationError');
    });
  });

  describe('isWorkspaceNameAvailable', () => {
    it('should return true for available name', async () => {
      const available =
        await workspaceService.isWorkspaceNameAvailable('Available Name');
      expect(available).toBe(true);
    });

    it('should return false for taken name', async () => {
      await workspaceService.createWorkspace(
        {
          name: 'Taken Name',
          description: 'Test',
        },
        mockUserId
      );

      const available =
        await workspaceService.isWorkspaceNameAvailable('Taken Name');
      expect(available).toBe(false);
    });
  });

  describe('isWorkspaceAdmin', () => {
    it('should return true for workspace creator', async () => {
      const created = await workspaceService.createWorkspace(
        {
          name: 'Admin Test',
          description: 'Test',
        },
        mockUserId
      );

      const isAdmin = await workspaceService.isWorkspaceAdmin(
        created.id,
        mockUserId
      );
      expect(isAdmin).toBe(true);
    });

    it('should return false for non-admin user', async () => {
      const created = await workspaceService.createWorkspace(
        {
          name: 'Admin Test 2',
          description: 'Test',
        },
        mockUserId
      );

      const isAdmin = await workspaceService.isWorkspaceAdmin(
        created.id,
        'other-user'
      );
      expect(isAdmin).toBe(false);
    });
  });
});
