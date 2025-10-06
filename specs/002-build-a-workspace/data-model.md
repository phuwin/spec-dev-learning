# Data Model: Workspace Creation System

**Feature**: 002-build-a-workspace  
**Date**: 2024-12-19  
**Status**: Complete

## Entities

### Workspace
Represents a team collaboration space with basic settings and admin permissions.

**Fields**:
- `id: string` - Unique identifier (UUID)
- `name: string` - Workspace name (globally unique, non-empty)
- `description: string` - Optional workspace description
- `creatorId: string` - ID of the user who created the workspace
- `createdAt: Date` - Timestamp when workspace was created
- `updatedAt: Date` - Timestamp when workspace was last updated

**Validation Rules**:
- `name`: Required, non-empty string, globally unique across all workspaces
- `description`: Optional string (can be empty)
- `creatorId`: Required, must reference existing user
- `id`: Auto-generated UUID
- `createdAt`: Auto-generated timestamp
- `updatedAt`: Auto-generated timestamp, updated on modifications

**State Transitions**:
- `CREATED` → `ACTIVE` (immediately after creation)
- `ACTIVE` → `ACTIVE` (on name/description updates)

### WorkspaceAdmin
Represents a user with administrative permissions for a specific workspace.

**Fields**:
- `workspaceId: string` - Reference to workspace
- `userId: string` - Reference to user
- `permissions: string[]` - Array of permission strings
- `assignedAt: Date` - When admin role was assigned

**Validation Rules**:
- `workspaceId`: Required, must reference existing workspace
- `userId`: Required, must reference existing user
- `permissions`: Always includes "manage_settings" for workspace admins
- `assignedAt`: Auto-generated timestamp

**Relationships**:
- Many-to-one with Workspace (many admins per workspace)
- Many-to-one with User (user can be admin of multiple workspaces)

## Data Storage

**Storage Method**: Local Storage (MVP approach)
**Key Pattern**: `workspaces:{workspaceId}` for individual workspaces
**Index Pattern**: `workspace_names` for uniqueness checking
**Admin Pattern**: `workspace_admins:{workspaceId}` for admin relationships

## Business Rules

1. **Global Uniqueness**: Workspace names must be unique across all users
2. **Creator as Admin**: Workspace creator automatically becomes admin
3. **Admin Permissions**: Admins can modify workspace name and description only
4. **No Limits**: Users can create unlimited workspaces
5. **Public by Default**: All workspaces are public (no privacy levels)

## TypeScript Interfaces

```typescript
interface Workspace {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WorkspaceAdmin {
  workspaceId: string;
  userId: string;
  permissions: string[];
  assignedAt: Date;
}

interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
}
```
