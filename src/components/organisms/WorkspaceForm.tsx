/**
 * WorkspaceForm Component
 * Form for creating and editing workspaces
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Text } from '../atoms/Text';
import { ErrorMessage } from '../atoms/ErrorMessage';
import { FormField } from '../molecules/FormField';
import { useWorkspaceNameAvailability } from '../../hooks/useWorkspace';
import type { CreateWorkspaceRequest, UpdateWorkspaceRequest } from '../../types/workspace';

interface WorkspaceFormProps {
  mode?: 'create' | 'edit';
  initialData?: Partial<CreateWorkspaceRequest>;
  onSubmit: (data: CreateWorkspaceRequest | UpdateWorkspaceRequest) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const WorkspaceForm: React.FC<WorkspaceFormProps> = ({
  mode = 'create',
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  error: externalError,
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
  });
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const { name, setName, isAvailable, isChecking, error: nameCheckError } = useWorkspaceNameAvailability();

  // Update name availability check when form name changes
  useEffect(() => {
    setName(formData.name);
  }, [formData.name, setName]);

  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Workspace name is required';
    } else if (formData.name.length > 100) {
      errors.name = 'Workspace name must be 100 characters or less';
    } else if (isAvailable === false && mode === 'create') {
      errors.name = 'Workspace name is already taken';
    }

    // Validate description
    if (formData.description.length > 500) {
      errors.description = 'Workspace description must be 500 characters or less';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const getAvailabilityMessage = () => {
    if (isChecking) {
      return <Text variant="sm" color="muted">Checking availability...</Text>;
    }

    if (nameCheckError) {
      return <Text variant="sm" color="destructive">Error checking name availability</Text>;
    }

    if (formData.name && isAvailable === true) {
      return <Text variant="sm" color="success">Name is available</Text>;
    }

    if (formData.name && isAvailable === false && mode === 'create') {
      return <Text variant="sm" color="destructive">Name is already taken</Text>;
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {externalError && (
        <ErrorMessage message={externalError} />
      )}

      <div className="space-y-4">
        <FormField
          label="Workspace Name"
          required
          error={validationErrors.name}
        >
          <Input
            type="text"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="Enter workspace name"
            disabled={isLoading}
            className={validationErrors.name ? 'border-red-500' : ''}
          />
          {getAvailabilityMessage()}
        </FormField>

        <FormField
          label="Description"
          error={validationErrors.description}
          helpText="Optional description for your workspace"
        >
          <textarea
            value={formData.description}
            onChange={handleInputChange('description')}
            placeholder="Enter workspace description (optional)"
            disabled={isLoading}
            rows={3}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${validationErrors.description ? 'border-red-500' : ''
              }`}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formData.description.length}/500 characters</span>
          </div>
        </FormField>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || isChecking || (isAvailable === false && mode === 'create')}
        >
          {isLoading ? 'Creating...' : mode === 'create' ? 'Create Workspace' : 'Update Workspace'}
        </Button>
      </div>
    </form>
  );
};
