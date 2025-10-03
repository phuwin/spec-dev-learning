# Data Model: User Registration

**Feature**: User Registration  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Entities

### User
Represents a registered user account in the system.

**Fields**:
- `id` (number, primary key): Unique identifier for the user
- `email` (string, unique, required): User's email address
- `password_hash` (string, required): Hashed password using bcrypt
- `created_at` (datetime, required): Account creation timestamp
- `updated_at` (datetime, required): Last update timestamp

**Validation Rules**:
- Email must be valid format (RFC 5322)
- Email must be unique across all users
- Password hash must be valid bcrypt hash
- Created_at and updated_at must be valid timestamps

**State Transitions**:
- `unregistered` → `registered`: User completes registration
- `registered` → `registered`: User updates profile (future)

**Database Schema**:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

## Data Transfer Objects (DTOs)

### RegisterRequest
Request payload for user registration.

```typescript
interface RegisterRequest {
  email: string;
  password: string;
}
```

**Validation**:
- Email: Valid email format, required
- Password: 8+ characters, 1 uppercase, 1 lowercase, 1 number, 1 special character, required

### RegisterResponse
Response payload for successful registration.

```typescript
interface RegisterResponse {
  user: {
    id: number;
    email: string;
    created_at: string;
  };
  token: string;
}
```

### ErrorResponse
Standard error response format.

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**Error Codes**:
- `VALIDATION_ERROR`: Input validation failed
- `EMAIL_ALREADY_EXISTS`: Email is already registered
- `INVALID_EMAIL_FORMAT`: Email format is invalid
- `WEAK_PASSWORD`: Password doesn't meet strength requirements
- `INTERNAL_ERROR`: Server error occurred

## API Contracts

### POST /api/auth/register
Register a new user account.

**Request**:
- Method: POST
- Content-Type: application/json
- Body: RegisterRequest

**Response**:
- Success (201): RegisterResponse
- Error (400): ErrorResponse (validation errors)
- Error (409): ErrorResponse (email already exists)
- Error (500): ErrorResponse (internal error)

**Example Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Example Response (Success)**:
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2025-01-27T10:30:00Z"
  },
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example Response (Error)**:
```json
{
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "An account with this email already exists"
  }
}
```

## Business Rules

### Email Validation
- Must be valid email format according to RFC 5322
- Must be unique across all users
- Case-insensitive comparison
- Maximum length: 255 characters

### Password Validation
- Minimum length: 8 characters
- Must contain at least 1 uppercase letter
- Must contain at least 1 lowercase letter
- Must contain at least 1 number
- Must contain at least 1 special character
- Maximum length: 128 characters

### Security Rules
- Passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens expire after 24 hours
- No password storage in plain text
- Input sanitization to prevent XSS attacks

## Data Relationships

### User → Todo Items (Future)
- One user can have many todo items
- Foreign key: todo_items.user_id → users.id
- Cascade delete: When user is deleted, their todos are deleted

### User → Sessions (Future)
- One user can have multiple active sessions
- Foreign key: sessions.user_id → users.id
- Used for session management and security

## Performance Considerations

### Database Indexes
- Primary key on `id` (automatic)
- Unique index on `email` for fast lookups
- Consider composite indexes for future queries

### Caching Strategy
- JWT tokens can be cached on client side
- User data can be cached after login
- No server-side caching needed for MVP

### Scalability
- Database can be migrated to PostgreSQL for production
- JWT tokens are stateless, no server-side storage
- Horizontal scaling possible with load balancers
