/**
 * Workspace Service Integration Contract Tests
 * Tests the workspace service implementation against its contract
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { workspaceService } from '../../../src/services/workspaceService';
import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '../../../src/types/workspace';

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Workspace Service Contract Integration', () => {
  const testUserId = 'user-123';
  const testWorkspaceId = 'workspace-123';

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('createWorkspace', () => {
    it('should create a workspace and store it in localStorage', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const workspace = await workspaceService.createWorkspace(
        request,
        testUserId
      );

      expect(workspace).toBeDefined();
      expect(workspace.name).toBe(request.name);
      expect(workspace.description).toBe(request.description);
      expect(workspace.creatorId).toBe(testUserId);
      expect(workspace.id).toBeDefined();
      expect(workspace.createdAt).toBeInstanceOf(Date);
      expect(workspace.updatedAt).toBeInstanceOf(Date);

      // Verify stored in localStorage
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should throw error for empty workspace name', async () => {
      const request: CreateWorkspaceRequest = {
        name: '',
        description: 'A test workspace',
      };

      await expect(
        workspaceService.createWorkspace(request, testUserId)
      ).rejects.toThrow();
    });

    it('should throw error for duplicate workspace name', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      // Create first workspace
      await workspaceService.createWorkspace(request, testUserId);

      // Try to create second workspace with same name
      await expect(
        workspaceService.createWorkspace(request, testUserId)
      ).rejects.toThrow();
    });
  });

  describe('getUserWorkspaces', () => {
    it('should return empty array for user with no workspaces', async () => {
      const workspaces = await workspaceService.getUserWorkspaces(testUserId);
      expect(workspaces).toEqual([]);
    });

    it('should return user workspaces', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      await workspaceService.createWorkspace(request, testUserId);
      const workspaces = await workspaceService.getUserWorkspaces(testUserId);

      expect(workspaces).toHaveLength(1);
      expect(workspaces[0].name).toBe(request.name);
    });
  });

  describe('getWorkspace', () => {
    it('should return null for non-existent workspace', async () => {
      const workspace = await workspaceService.getWorkspace('non-existent');
      expect(workspace).toBeNull();
    });

    it('should return workspace by id', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await workspaceService.createWorkspace(
        request,
        testUserId
      );
      const retrieved = await workspaceService.getWorkspace(created.id);

      expect(retrieved).toEqual(created);
    });
  });

  describe('updateWorkspace', () => {
    it('should update workspace name', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await workspaceService.createWorkspace(
        request,
        testUserId
      );
      const updateRequest: UpdateWorkspaceRequest = {
        name: 'Updated Workspace',
      };

      const updated = await workspaceService.updateWorkspace(
        created.id,
        updateRequest,
        testUserId
      );

      expect(updated.name).toBe('Updated Workspace');
      expect(updated.description).toBe(request.description);
    });

    it('should throw error for non-admin user', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await workspaceService.createWorkspace(
        request,
        testUserId
      );
      const updateRequest: UpdateWorkspaceRequest = {
        name: 'Updated Workspace',
      };

      await expect(
        workspaceService.updateWorkspace(
          created.id,
          updateRequest,
          'other-user'
        )
      ).rejects.toThrow();
    });
  });

  describe('deleteWorkspace', () => {
    it('should delete workspace', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await workspaceService.createWorkspace(
        request,
        testUserId
      );
      await workspaceService.deleteWorkspace(created.id, testUserId);

      const retrieved = await workspaceService.getWorkspace(created.id);
      expect(retrieved).toBeNull();
    });

    it('should throw error for non-admin user', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await workspaceService.createWorkspace(
        request,
        testUserId
      );

      await expect(
        workspaceService.deleteWorkspace(created.id, 'other-user')
      ).rejects.toThrow();
    });
  });

  describe('isWorkspaceNameAvailable', () => {
    it('should return true for available name', async () => {
      const available =
        await workspaceService.isWorkspaceNameAvailable('Available Name');
      expect(available).toBe(true);
    });

    it('should return false for existing name', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      await workspaceService.createWorkspace(request, testUserId);
      const available =
        await workspaceService.isWorkspaceNameAvailable('Test Workspace');
      expect(available).toBe(false);
    });
  });

  describe('isWorkspaceAdmin', () => {
    it('should return true for workspace creator', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await workspaceService.createWorkspace(
        request,
        testUserId
      );
      const isAdmin = await workspaceService.isWorkspaceAdmin(
        created.id,
        testUserId
      );
      expect(isAdmin).toBe(true);
    });

    it('should return false for non-admin user', async () => {
      const request: CreateWorkspaceRequest = {
        name: 'Test Workspace',
        description: 'A test workspace',
      };

      const created = await workspaceService.createWorkspace(
        request,
        testUserId
      );
      const isAdmin = await workspaceService.isWorkspaceAdmin(
        created.id,
        'other-user'
      );
      expect(isAdmin).toBe(false);
    });
  });
});
