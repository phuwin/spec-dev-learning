/**
 * Workspace Test Utilities
 * Helper functions and utilities for workspace testing
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthProvider';
import type { User, Workspace } from '../../src/types/workspace';

// Mock user for testing
const mockUser: User = {
  id: 'user-123',
  email: 'test@example.com',
  createdAt: new Date('2024-01-01T00:00:00Z'),
};

// Mock workspace for testing
const mockWorkspace: Workspace = {
  id: 'workspace-123',
  name: 'Test Workspace',
  description: 'A test workspace',
  creatorId: 'user-123',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  user?: User;
  workspaces?: Workspace[];
  initialRoute?: string;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const {
    user = mockUser,
    workspaces = [mockWorkspace],
    initialRoute = '/',
    ...renderOptions
  } = options;

  // Mock the auth context
  const mockAuthContext = {
    user,
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  };

  // Mock the workspace service
  const mockWorkspaceService = {
    createWorkspace: vi.fn(),
    getUserWorkspaces: vi.fn().mockResolvedValue(workspaces),
    getWorkspace: vi.fn(),
    updateWorkspace: vi.fn(),
    deleteWorkspace: vi.fn(),
    isWorkspaceNameAvailable: vi.fn(),
    isWorkspaceAdmin: vi.fn(),
  };

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <AuthProvider value={mockAuthContext}>
          {children}
        </AuthProvider>
      </BrowserRouter>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    mockAuthContext,
    mockWorkspaceService,
  };
}

// Test data factories
export const createTestWorkspace = (overrides: Partial<Workspace> = {}): Workspace => ({
  id: 'workspace-123',
  name: 'Test Workspace',
  description: 'A test workspace',
  creatorId: 'user-123',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

export const createTestUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  email: 'test@example.com',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

// Mock functions
export const createMockWorkspaceService = () => ({
  createWorkspace: vi.fn(),
  getUserWorkspaces: vi.fn(),
  getWorkspace: vi.fn(),
  updateWorkspace: vi.fn(),
  deleteWorkspace: vi.fn(),
  isWorkspaceNameAvailable: vi.fn(),
  isWorkspaceAdmin: vi.fn(),
});

export const createMockAuthContext = (user?: User) => ({
  user: user || mockUser,
  isAuthenticated: !!user,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
});

// Test constants
export const TEST_CONSTANTS = {
  WORKSPACE_ID: 'workspace-123',
  USER_ID: 'user-123',
  WORKSPACE_NAME: 'Test Workspace',
  WORKSPACE_DESCRIPTION: 'A test workspace',
  WORKSPACE_NAME_TAKEN: 'Taken Workspace',
  WORKSPACE_NAME_AVAILABLE: 'Available Workspace',
} as const;

// Helper functions
export const waitForWorkspaceLoad = async () => {
  // Wait for any async workspace operations to complete
  await new Promise(resolve => setTimeout(resolve, 0));
};

export const mockLocalStorage = () => {
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

  return localStorageMock;
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
