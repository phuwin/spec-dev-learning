/**
 * useWorkspace Hook
 * React hook for workspace management operations
 */

import { useState, useEffect, useCallback } from 'react';
import { workspaceService } from '../services/workspaceService';
import type {
  Workspace,
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
  WorkspaceConcurrencyError,
  getWorkspaceErrorMessage,
} from '../services/workspaceErrors';

interface UseWorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
}

interface UseWorkspaceActions {
  createWorkspace: (
    request: CreateWorkspaceRequest,
    userId: string
  ) => Promise<Workspace | null>;
  updateWorkspace: (
    workspaceId: string,
    request: UpdateWorkspaceRequest,
    userId: string
  ) => Promise<Workspace | null>;
  deleteWorkspace: (workspaceId: string, userId: string) => Promise<boolean>;
  getWorkspace: (workspaceId: string) => Promise<Workspace | null>;
  getUserWorkspaces: (userId: string) => Promise<Workspace[]>;
  isWorkspaceNameAvailable: (name: string) => Promise<boolean>;
  isWorkspaceAdmin: (workspaceId: string, userId: string) => Promise<boolean>;
  listWorkspaces: (
    filters?: WorkspaceListFilters
  ) => Promise<WorkspaceListResult>;
  clearError: () => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
}

export function useWorkspace(): UseWorkspaceState & UseWorkspaceActions {
  const [state, setState] = useState<UseWorkspaceState>({
    workspaces: [],
    currentWorkspace: null,
    isLoading: false,
    error: null,
  });

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const setCurrentWorkspace = useCallback((workspace: Workspace | null) => {
    setState((prev) => ({ ...prev, currentWorkspace: workspace }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const createWorkspace = useCallback(
    async (
      request: CreateWorkspaceRequest,
      userId: string
    ): Promise<Workspace | null> => {
      try {
        setLoading(true);
        clearError();

        const workspace = await workspaceService.createWorkspace(
          request,
          userId
        );

        setState((prev) => ({
          ...prev,
          workspaces: [...prev.workspaces, workspace],
          currentWorkspace: workspace,
          isLoading: false,
        }));

        return workspace;
      } catch (error) {
        const errorMessage = getWorkspaceErrorMessage(error);
        setError(errorMessage);
        return null;
      }
    },
    [setLoading, clearError, setError]
  );

  const updateWorkspace = useCallback(
    async (
      workspaceId: string,
      request: UpdateWorkspaceRequest,
      userId: string
    ): Promise<Workspace | null> => {
      try {
        setLoading(true);
        clearError();

        const workspace = await workspaceService.updateWorkspace(
          workspaceId,
          request,
          userId
        );

        setState((prev) => ({
          ...prev,
          workspaces: prev.workspaces.map((w) =>
            w.id === workspaceId ? workspace : w
          ),
          currentWorkspace:
            prev.currentWorkspace?.id === workspaceId
              ? workspace
              : prev.currentWorkspace,
          isLoading: false,
        }));

        return workspace;
      } catch (error) {
        const errorMessage = getWorkspaceErrorMessage(error);
        setError(errorMessage);
        return null;
      }
    },
    [setLoading, clearError, setError]
  );

  const deleteWorkspace = useCallback(
    async (workspaceId: string, userId: string): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        await workspaceService.deleteWorkspace(workspaceId, userId);

        setState((prev) => ({
          ...prev,
          workspaces: prev.workspaces.filter((w) => w.id !== workspaceId),
          currentWorkspace:
            prev.currentWorkspace?.id === workspaceId
              ? null
              : prev.currentWorkspace,
          isLoading: false,
        }));

        return true;
      } catch (error) {
        const errorMessage = getWorkspaceErrorMessage(error);
        setError(errorMessage);
        return false;
      }
    },
    [setLoading, clearError, setError]
  );

  const getWorkspace = useCallback(
    async (workspaceId: string): Promise<Workspace | null> => {
      try {
        setLoading(true);
        clearError();

        const workspace = await workspaceService.getWorkspace(workspaceId);

        setState((prev) => ({
          ...prev,
          currentWorkspace: workspace,
          isLoading: false,
        }));

        return workspace;
      } catch (error) {
        const errorMessage = getWorkspaceErrorMessage(error);
        setError(errorMessage);
        return null;
      }
    },
    [setLoading, clearError, setError]
  );

  const getUserWorkspaces = useCallback(
    async (userId: string): Promise<Workspace[]> => {
      try {
        setLoading(true);
        clearError();

        const workspaces = await workspaceService.getUserWorkspaces(userId);

        setState((prev) => ({
          ...prev,
          workspaces,
          isLoading: false,
        }));

        return workspaces;
      } catch (error) {
        const errorMessage = getWorkspaceErrorMessage(error);
        setError(errorMessage);
        return [];
      }
    },
    [setLoading, clearError, setError]
  );

  const isWorkspaceNameAvailable = useCallback(
    async (name: string): Promise<boolean> => {
      try {
        return await workspaceService.isWorkspaceNameAvailable(name);
      } catch (error) {
        console.error('Error checking workspace name availability:', error);
        return false;
      }
    },
    []
  );

  const isWorkspaceAdmin = useCallback(
    async (workspaceId: string, userId: string): Promise<boolean> => {
      try {
        return await workspaceService.isWorkspaceAdmin(workspaceId, userId);
      } catch (error) {
        console.error('Error checking workspace admin status:', error);
        return false;
      }
    },
    []
  );

  const listWorkspaces = useCallback(
    async (filters?: WorkspaceListFilters): Promise<WorkspaceListResult> => {
      try {
        setLoading(true);
        clearError();

        const result = await workspaceService.listWorkspaces(filters);

        setState((prev) => ({
          ...prev,
          workspaces: result.workspaces,
          isLoading: false,
        }));

        return result;
      } catch (error) {
        const errorMessage = getWorkspaceErrorMessage(error);
        setError(errorMessage);
        return {
          workspaces: [],
          total: 0,
          hasMore: false,
        };
      }
    },
    [setLoading, clearError, setError]
  );

  return {
    ...state,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    getWorkspace,
    getUserWorkspaces,
    isWorkspaceNameAvailable,
    isWorkspaceAdmin,
    listWorkspaces,
    clearError,
    setCurrentWorkspace,
  };
}

// Hook for workspace name availability checking with debouncing
export function useWorkspaceNameAvailability(debounceMs: number = 300) {
  const [name, setName] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isWorkspaceNameAvailable } = useWorkspace();

  useEffect(() => {
    if (!name.trim()) {
      setIsAvailable(null);
      setIsChecking(false);
      setError(null);
      return;
    }

    setIsChecking(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const available = await isWorkspaceNameAvailable(name);
        setIsAvailable(available);
        setError(null);
      } catch (err) {
        setError('Failed to check name availability');
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [name, debounceMs, isWorkspaceNameAvailable]);

  return {
    name,
    setName,
    isAvailable,
    isChecking,
    error,
  };
}
