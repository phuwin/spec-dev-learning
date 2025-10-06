/**
 * Workspace Test Fixtures
 * Test data factories and fixtures for workspace scenarios
 */

import type {
  User,
  Workspace,
  WorkspaceAdmin,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '../../src/types/workspace';

// User fixtures
export const createUserFixture = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  email: 'test@example.com',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

export const createAdminUserFixture = (
  overrides: Partial<User> = {}
): User => ({
  id: 'admin-123',
  email: 'admin@example.com',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

export const createRegularUserFixture = (
  overrides: Partial<User> = {}
): User => ({
  id: 'regular-123',
  email: 'regular@example.com',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

// Workspace fixtures
export const createWorkspaceFixture = (
  overrides: Partial<Workspace> = {}
): Workspace => ({
  id: 'workspace-123',
  name: 'Test Workspace',
  description: 'A test workspace',
  creatorId: 'user-123',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

export const createPublicWorkspaceFixture = (
  overrides: Partial<Workspace> = {}
): Workspace => ({
  id: 'public-workspace-123',
  name: 'Public Workspace',
  description: 'A public workspace',
  creatorId: 'user-123',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

export const createPrivateWorkspaceFixture = (
  overrides: Partial<Workspace> = {}
): Workspace => ({
  id: 'private-workspace-123',
  name: 'Private Workspace',
  description: 'A private workspace',
  creatorId: 'user-123',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

// WorkspaceAdmin fixtures
export const createWorkspaceAdminFixture = (
  overrides: Partial<WorkspaceAdmin> = {}
): WorkspaceAdmin => ({
  workspaceId: 'workspace-123',
  userId: 'user-123',
  permissions: ['manage_settings'],
  assignedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

// Request fixtures
export const createCreateWorkspaceRequestFixture = (
  overrides: Partial<CreateWorkspaceRequest> = {}
): CreateWorkspaceRequest => ({
  name: 'Test Workspace',
  description: 'A test workspace',
  ...overrides,
});

export const createUpdateWorkspaceRequestFixture = (
  overrides: Partial<UpdateWorkspaceRequest> = {}
): UpdateWorkspaceRequest => ({
  name: 'Updated Workspace',
  description: 'An updated workspace',
  ...overrides,
});

// Scenario fixtures
export const createWorkspaceCreationScenario = () => ({
  user: createUserFixture(),
  request: createCreateWorkspaceRequestFixture(),
  expectedWorkspace: createWorkspaceFixture(),
});

export const createWorkspaceUpdateScenario = () => ({
  user: createUserFixture(),
  workspace: createWorkspaceFixture(),
  updateRequest: createUpdateWorkspaceRequestFixture(),
  expectedUpdatedWorkspace: createWorkspaceFixture({
    name: 'Updated Workspace',
    description: 'An updated workspace',
    updatedAt: new Date('2024-01-02T00:00:00Z'),
  }),
});

export const createWorkspaceDeletionScenario = () => ({
  user: createUserFixture(),
  workspace: createWorkspaceFixture(),
});

export const createWorkspaceNameConflictScenario = () => ({
  user: createUserFixture(),
  existingWorkspace: createWorkspaceFixture({ name: 'Existing Workspace' }),
  conflictingRequest: createCreateWorkspaceRequestFixture({
    name: 'Existing Workspace',
  }),
});

export const createWorkspaceAuthorizationScenario = () => ({
  adminUser: createAdminUserFixture(),
  regularUser: createRegularUserFixture(),
  workspace: createWorkspaceFixture({ creatorId: 'admin-123' }),
  unauthorizedUpdateRequest: createUpdateWorkspaceRequestFixture(),
});

// Error scenario fixtures
export const createValidationErrorScenario = () => ({
  user: createUserFixture(),
  invalidRequest: createCreateWorkspaceRequestFixture({ name: '' }),
  expectedError: 'Workspace name is required',
});

export const createNetworkErrorScenario = () => ({
  user: createUserFixture(),
  request: createCreateWorkspaceRequestFixture(),
  expectedError: 'Network error',
});

export const createConcurrencyErrorScenario = () => ({
  user: createUserFixture(),
  request: createCreateWorkspaceRequestFixture({
    name: 'Concurrent Workspace',
  }),
  expectedError: 'Concurrent creation attempt detected',
});

// Test data sets
export const createMultipleWorkspacesFixture = (
  count: number = 3
): Workspace[] => {
  return Array.from({ length: count }, (_, index) =>
    createWorkspaceFixture({
      id: `workspace-${index + 1}`,
      name: `Workspace ${index + 1}`,
      description: `Description for workspace ${index + 1}`,
    })
  );
};

export const createMultipleUsersFixture = (count: number = 3): User[] => {
  return Array.from({ length: count }, (_, index) =>
    createUserFixture({
      id: `user-${index + 1}`,
      email: `user${index + 1}@example.com`,
    })
  );
};

// Mock data for localStorage
export const createLocalStorageMockData = () => ({
  workspaces: {
    'workspace-123': createWorkspaceFixture(),
    'workspace-456': createWorkspaceFixture({
      id: 'workspace-456',
      name: 'Another Workspace',
      description: 'Another test workspace',
    }),
  },
  workspaceAdmins: {
    'workspace-123': ['user-123'],
    'workspace-456': ['user-123'],
  },
  workspaceNames: ['Test Workspace', 'Another Workspace'],
});

// Test constants
export const WORKSPACE_TEST_CONSTANTS = {
  VALID_WORKSPACE_NAME: 'Valid Workspace Name',
  INVALID_WORKSPACE_NAME: '',
  TAKEN_WORKSPACE_NAME: 'Taken Workspace Name',
  LONG_WORKSPACE_NAME: 'A'.repeat(101),
  VALID_DESCRIPTION: 'A valid workspace description',
  LONG_DESCRIPTION: 'A'.repeat(501),
  VALID_USER_ID: 'user-123',
  INVALID_USER_ID: 'invalid-user',
  VALID_WORKSPACE_ID: 'workspace-123',
  INVALID_WORKSPACE_ID: 'invalid-workspace',
} as const;
