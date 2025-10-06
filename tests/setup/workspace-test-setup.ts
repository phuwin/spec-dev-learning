/**
 * Workspace Test Setup
 * Test configuration and utilities for workspace components
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock localStorage for workspace tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress console.error and console.warn in tests unless explicitly needed
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  // Restore console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

beforeEach(() => {
  // Clear localStorage before each test
  localStorageMock.clear();

  // Clear all mocks
  vi.clearAllMocks();
});

afterEach(() => {
  // Clean up React components
  cleanup();
});

// Test data factories
export const createMockWorkspace = (
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

export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  email: 'test@example.com',
  createdAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

// Mock workspace service
export const createMockWorkspaceService = () => ({
  createWorkspace: vi.fn(),
  getUserWorkspaces: vi.fn(),
  getWorkspace: vi.fn(),
  updateWorkspace: vi.fn(),
  deleteWorkspace: vi.fn(),
  isWorkspaceNameAvailable: vi.fn(),
  isWorkspaceAdmin: vi.fn(),
});

// Test constants
export const TEST_CONSTANTS = {
  WORKSPACE_ID: 'workspace-123',
  USER_ID: 'user-123',
  WORKSPACE_NAME: 'Test Workspace',
  WORKSPACE_DESCRIPTION: 'A test workspace',
} as const;
