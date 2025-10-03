# Data Model: User Registration and Login

**Feature**: 001-user-can-register  
**Date**: 2024-12-19  
**Storage**: localStorage (frontend-only MVP)

## Entities

### User Account
**Purpose**: Represents a registered user with authentication credentials  
**Storage Key**: `auth_users`  
**Fields**:
- `id`: string (unique identifier, UUID)
- `email`: string (unique, user's email address)
- `password`: string (hashed password for security)
- `createdAt`: string (ISO 8601 timestamp)
- `lastLoginAt`: string (ISO 8601 timestamp, nullable)

**Validation Rules**:
- Email must contain @ symbol and have text before/after
- Password must be non-empty string
- Email must be unique across all users
- All fields are required except lastLoginAt

**State Transitions**:
- `unregistered` → `registered` (via registration)
- `registered` → `active` (via login)
- `active` → `inactive` (via logout)

### User Session
**Purpose**: Represents an active user login session  
**Storage Key**: `auth_session`  
**Fields**:
- `userId`: string (references User Account id)
- `email`: string (user's email for quick access)
- `isActive`: boolean (session status)
- `createdAt`: string (ISO 8601 timestamp)
- `lastActivityAt`: string (ISO 8601 timestamp)

**Validation Rules**:
- userId must reference existing User Account
- email must match the referenced User Account
- isActive must be boolean
- All fields are required

**State Transitions**:
- `inactive` → `active` (via successful login)
- `active` → `inactive` (via logout or browser close)

### Registration Attempt
**Purpose**: Represents a user's attempt to create a new account  
**Storage Key**: `auth_registration_attempts` (temporary, for analytics)  
**Fields**:
- `email`: string (attempted email)
- `timestamp`: string (ISO 8601 timestamp)
- `success`: boolean (whether registration succeeded)
- `errorMessage`: string (error details if failed, nullable)

**Validation Rules**:
- email must be valid format
- timestamp must be valid ISO 8601
- success must be boolean
- errorMessage required if success is false

### Login Attempt
**Purpose**: Represents a user's attempt to authenticate  
**Storage Key**: `auth_login_attempts` (temporary, for analytics)  
**Fields**:
- `email`: string (attempted email)
- `timestamp`: string (ISO 8601 timestamp)
- `success`: boolean (whether login succeeded)
- `errorMessage`: string (error details if failed, nullable)

**Validation Rules**:
- email must be valid format
- timestamp must be valid ISO 8601
- success must be boolean
- errorMessage required if success is false

## Relationships

- **User Account** 1:1 **User Session** (one active session per user)
- **User Account** 1:many **Registration Attempts** (one account can have multiple registration attempts)
- **User Account** 1:many **Login Attempts** (one account can have multiple login attempts)

## Storage Strategy

### localStorage Keys
- `auth_users`: Array of User Account objects
- `auth_session`: Single User Session object (or null)
- `auth_registration_attempts`: Array of Registration Attempt objects (max 100, FIFO)
- `auth_login_attempts`: Array of Login Attempt objects (max 100, FIFO)

### Data Persistence
- User accounts persist until manually deleted
- Sessions persist until logout or browser data cleared
- Attempt logs are limited to 100 entries each (FIFO cleanup)

### Error Handling
- localStorage quota exceeded: Clear attempt logs, show user message
- Corrupted data: Clear affected storage, show user message
- Missing data: Initialize with empty arrays/objects

## TypeScript Interfaces

```typescript
interface UserAccount {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  lastLoginAt?: string;
}

interface UserSession {
  userId: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastActivityAt: string;
}

interface RegistrationAttempt {
  email: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

interface LoginAttempt {
  email: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}
```
