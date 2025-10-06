/**
 * WorkspaceList Component
 * List view for displaying and managing workspaces
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Text } from '../atoms/Text';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../molecules/Card';
import { Badge } from '../atoms/Badge';
import { useWorkspace } from '../../hooks/useWorkspace';
import type { Workspace, WorkspaceListFilters } from '../../types/workspace';

interface WorkspaceListProps {
  userId: string;
  onWorkspaceSelect?: (workspace: Workspace) => void;
  onWorkspaceEdit?: (workspace: Workspace) => void;
  onWorkspaceDelete?: (workspace: Workspace) => void;
  showActions?: boolean;
}

export const WorkspaceList: React.FC<WorkspaceListProps> = ({
  userId,
  onWorkspaceSelect,
  onWorkspaceEdit,
  onWorkspaceDelete,
  showActions = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  const {
    workspaces,
    isLoading,
    error,
    getUserWorkspaces,
    deleteWorkspace,
    clearError,
  } = useWorkspace();

  useEffect(() => {
    getUserWorkspaces(userId);
  }, [userId, getUserWorkspaces]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWorkspaceClick = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    onWorkspaceSelect?.(workspace);
  };

  const handleEdit = (event: React.MouseEvent, workspace: Workspace) => {
    event.stopPropagation();
    onWorkspaceEdit?.(workspace);
  };

  const handleDelete = async (event: React.MouseEvent, workspace: Workspace) => {
    event.stopPropagation();

    if (window.confirm(`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`)) {
      const success = await deleteWorkspace(workspace.id, userId);
      if (success) {
        onWorkspaceDelete?.(workspace);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <Text>Loading workspaces...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <Text variant="sm" className="text-red-800">
              Error loading workspaces: {error}
            </Text>
            <Button
              variant="outline"
              size="sm"
              onClick={clearError}
              className="mt-2"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Text variant="lg" className="text-gray-500 mb-2">
                No workspaces found
              </Text>
              <Text variant="sm" className="text-gray-400">
                Create your first workspace to get started
              </Text>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search workspaces..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-1"
        />
        <Text variant="sm" className="text-gray-500">
          {filteredWorkspaces.length} of {workspaces.length} workspaces
        </Text>
      </div>

      {/* Workspace List */}
      <div className="space-y-3">
        {filteredWorkspaces.map((workspace) => (
          <Card
            key={workspace.id}
            className={`cursor-pointer transition-colors hover:bg-gray-50 ${selectedWorkspace?.id === workspace.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
            onClick={() => handleWorkspaceClick(workspace)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <Text variant="lg" weight="medium" className="text-gray-900 truncate">
                      {workspace.name}
                    </Text>
                    <Badge variant="secondary">Public</Badge>
                  </div>

                  {workspace.description && (
                    <Text variant="sm" className="text-gray-600 mb-2 line-clamp-2">
                      {workspace.description}
                    </Text>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created {formatDate(workspace.createdAt)}</span>
                    {workspace.updatedAt !== workspace.createdAt && (
                      <span>Updated {formatDate(workspace.updatedAt)}</span>
                    )}
                  </div>
                </div>

                {showActions && (
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleEdit(e, workspace)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => handleDelete(e, workspace)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkspaces.length === 0 && searchTerm && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Text variant="lg" className="text-gray-500 mb-2">
                No workspaces match your search
              </Text>
              <Text variant="sm" className="text-gray-400">
                Try adjusting your search terms
              </Text>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
