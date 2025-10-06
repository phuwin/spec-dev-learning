/**
 * WorkspaceSettings Component
 * Settings interface for workspace management
 */

import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../molecules/Card';
import { WorkspaceForm } from './WorkspaceForm';
import { useWorkspace } from '../../hooks/useWorkspace';
import type { Workspace, UpdateWorkspaceRequest } from '../../types/workspace';

interface WorkspaceSettingsProps {
  workspace: Workspace;
  userId: string;
  onWorkspaceUpdated?: (workspace: Workspace) => void;
  onWorkspaceDeleted?: () => void;
}

export const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({
  workspace,
  userId,
  onWorkspaceUpdated,
  onWorkspaceDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { updateWorkspace, deleteWorkspace, isLoading, error } = useWorkspace();

  const handleUpdate = async (data: UpdateWorkspaceRequest) => {
    try {
      const updatedWorkspace = await updateWorkspace(workspace.id, data, userId);
      if (updatedWorkspace) {
        setIsEditing(false);
        onWorkspaceUpdated?.(updatedWorkspace);
      }
    } catch (error) {
      console.error('Error updating workspace:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const success = await deleteWorkspace(workspace.id, userId);
      if (success) {
        onWorkspaceDeleted?.();
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    handleDelete();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setIsDeleting(false);
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Workspace</CardTitle>
          <CardDescription>
            Update your workspace settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkspaceForm
            mode="edit"
            initialData={{
              name: workspace.name,
              description: workspace.description,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Settings</CardTitle>
          <CardDescription>
            Manage your workspace configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Text variant="sm" weight="medium" className="text-gray-700">
              Workspace Name
            </Text>
            <Text variant="sm" className="text-gray-900">
              {workspace.name}
            </Text>
          </div>

          <div>
            <Text variant="sm" weight="medium" className="text-gray-700">
              Description
            </Text>
            <Text variant="sm" className="text-gray-900">
              {workspace.description || 'No description provided'}
            </Text>
          </div>

          <div>
            <Text variant="sm" weight="medium" className="text-gray-700">
              Created
            </Text>
            <Text variant="sm" className="text-gray-900">
              {new Date(workspace.createdAt).toLocaleDateString()}
            </Text>
          </div>

          <div>
            <Text variant="sm" weight="medium" className="text-gray-700">
              Last Updated
            </Text>
            <Text variant="sm" className="text-gray-900">
              {new Date(workspace.updatedAt).toLocaleDateString()}
            </Text>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              Edit Workspace
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isLoading}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>

      {showDeleteConfirm && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Delete Workspace</CardTitle>
            <CardDescription className="text-red-700">
              This action cannot be undone. All workspace data will be permanently deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Text variant="sm" className="text-red-800">
                Are you sure you want to delete "{workspace.name}"? This will permanently remove:
              </Text>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                <li>All workspace settings</li>
                <li>All workspace data</li>
                <li>All admin permissions</li>
              </ul>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Workspace'}
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
