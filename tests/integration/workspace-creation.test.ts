/**
 * Workspace Creation Integration Tests
 * End-to-end tests for workspace creation flow
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, createTestUser, createTestWorkspace } from '../utils/workspace-test-utils';
import { CreateWorkspacePage } from '../../../src/components/pages/CreateWorkspacePage';

// Mock the workspace service
const mockWorkspaceService = {
  createWorkspace: vi.fn(),
  getUserWorkspaces: vi.fn(),
  getWorkspace: vi.fn(),
  updateWorkspace: vi.fn(),
  deleteWorkspace: vi.fn(),
  isWorkspaceNameAvailable: vi.fn(),
  isWorkspaceAdmin: vi.fn(),
};

vi.mock('../../../src/services/workspaceService', () => ({
  workspaceService: mockWorkspaceService,
}));

describe('Workspace Creation Integration', () => {
  const mockUser = createTestUser();

  beforeEach(() => {
    vi.clearAllMocks();
    mockWorkspaceService.isWorkspaceNameAvailable.mockResolvedValue(true);
  });

  it('should complete full workspace creation flow', async () => {
    const createdWorkspace = createTestWorkspace();
    mockWorkspaceService.createWorkspace.mockResolvedValue(createdWorkspace);

    const { getByLabelText, getByRole, getByText } = renderWithProviders(
      <CreateWorkspacePage />,
      { user: mockUser }
    );

    // Fill out the form
    const nameInput = getByLabelText(/workspace name/i);
    const descriptionInput = getByLabelText(/description/i);
    const submitButton = getByRole('button', { name: /create workspace/i });

    nameInput.value = 'My New Workspace';
    descriptionInput.value = 'A workspace for my team';

    // Submit the form
    submitButton.click();

    // Verify workspace was created
    expect(mockWorkspaceService.createWorkspace).toHaveBeenCalledWith(
      {
        name: 'My New Workspace',
        description: 'A workspace for my team',
      },
      mockUser.id
    );

    // Verify success message or redirect
    expect(getByText(/workspace created successfully/i)).toBeInTheDocument();
  });

  it('should handle workspace name already exists error', async () => {
    mockWorkspaceService.createWorkspace.mockRejectedValue(
      new Error('Workspace name already exists')
    );

    const { getByLabelText, getByRole, getByText } = renderWithProviders(
      <CreateWorkspacePage />,
      { user: mockUser }
    );

    const nameInput = getByLabelText(/workspace name/i);
    const submitButton = getByRole('button', { name: /create workspace/i });

    nameInput.value = 'Existing Workspace';
    submitButton.click();

    expect(getByText(/workspace name already exists/i)).toBeInTheDocument();
  });

  it('should validate workspace name availability in real-time', async () => {
    mockWorkspaceService.isWorkspaceNameAvailable
      .mockResolvedValueOnce(false) // First check - name taken
      .mockResolvedValueOnce(true); // Second check - name available

    const { getByLabelText, getByText } = renderWithProviders(
      <CreateWorkspacePage />,
      { user: mockUser }
    );

    const nameInput = getByLabelText(/workspace name/i);
    
    // Type a name that's taken
    nameInput.value = 'Taken Name';
    nameInput.dispatchEvent(new Event('blur'));

    // Should show name taken message
    expect(getByText(/name is already taken/i)).toBeInTheDocument();

    // Type a name that's available
    nameInput.value = 'Available Name';
    nameInput.dispatchEvent(new Event('blur'));

    // Should show name available message
    expect(getByText(/name is available/i)).toBeInTheDocument();
  });

  it('should handle network errors gracefully', async () => {
    mockWorkspaceService.createWorkspace.mockRejectedValue(
      new Error('Network error')
    );

    const { getByLabelText, getByRole, getByText } = renderWithProviders(
      <CreateWorkspacePage />,
      { user: mockUser }
    );

    const nameInput = getByLabelText(/workspace name/i);
    const submitButton = getByRole('button', { name: /create workspace/i });

    nameInput.value = 'Test Workspace';
    submitButton.click();

    expect(getByText(/failed to create workspace/i)).toBeInTheDocument();
  });
});
