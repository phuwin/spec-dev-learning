/**
 * WorkspaceForm Unit Tests
 * Tests for the WorkspaceForm organism component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, createTestWorkspace, createTestUser } from '../../../utils/workspace-test-utils';
import { WorkspaceForm } from '../../../../src/components/organisms/WorkspaceForm';

// Mock the workspace service
vi.mock('../../../../src/services/workspaceService', () => ({
  workspaceService: {
    createWorkspace: vi.fn(),
    isWorkspaceNameAvailable: vi.fn(),
  },
}));

describe('WorkspaceForm', () => {
  const mockUser = createTestUser();
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render workspace creation form', () => {
    const { getByLabelText, getByRole } = renderWithProviders(
      <WorkspaceForm onSuccess={mockOnSuccess} onError={mockOnError} />,
      { user: mockUser }
    );

    expect(getByLabelText(/workspace name/i)).toBeInTheDocument();
    expect(getByLabelText(/description/i)).toBeInTheDocument();
    expect(getByRole('button', { name: /create workspace/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty name', async () => {
    const { getByRole, getByText } = renderWithProviders(
      <WorkspaceForm onSuccess={mockOnSuccess} onError={mockOnError} />,
      { user: mockUser }
    );

    const submitButton = getByRole('button', { name: /create workspace/i });
    submitButton.click();

    expect(getByText(/workspace name is required/i)).toBeInTheDocument();
  });

  it('should call onSuccess when workspace is created successfully', async () => {
    const { workspaceService } = vi.hoisted(() => ({
      workspaceService: {
        createWorkspace: vi.fn().mockResolvedValue(createTestWorkspace()),
        isWorkspaceNameAvailable: vi.fn().mockResolvedValue(true),
      },
    }));

    const { getByLabelText, getByRole } = renderWithProviders(
      <WorkspaceForm onSuccess={mockOnSuccess} onError={mockOnError} />,
      { user: mockUser }
    );

    const nameInput = getByLabelText(/workspace name/i);
    const descriptionInput = getByLabelText(/description/i);
    const submitButton = getByRole('button', { name: /create workspace/i });

    nameInput.value = 'Test Workspace';
    descriptionInput.value = 'A test workspace';
    submitButton.click();

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should call onError when workspace creation fails', async () => {
    const { workspaceService } = vi.hoisted(() => ({
      workspaceService: {
        createWorkspace: vi.fn().mockRejectedValue(new Error('Creation failed')),
        isWorkspaceNameAvailable: vi.fn().mockResolvedValue(true),
      },
    }));

    const { getByLabelText, getByRole } = renderWithProviders(
      <WorkspaceForm onSuccess={mockOnSuccess} onError={mockOnError} />,
      { user: mockUser }
    );

    const nameInput = getByLabelText(/workspace name/i);
    const submitButton = getByRole('button', { name: /create workspace/i });

    nameInput.value = 'Test Workspace';
    submitButton.click();

    expect(mockOnError).toHaveBeenCalled();
  });
});
