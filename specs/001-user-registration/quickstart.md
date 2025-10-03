# Quickstart: User Registration

**Feature**: User Registration  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Overview

This quickstart guide demonstrates the user registration flow for the multi-user todo application. Users can create accounts using email/password credentials and are automatically logged in upon successful registration.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser
- Git (for cloning the repository)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd spec-dev-learning

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create environment files for both backend and frontend:

**Backend (.env)**:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
DB_PATH=./database.sqlite
NODE_ENV=development
```

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Todo App
```

### 3. Database Setup

```bash
# Navigate to backend directory
cd backend

# Run database migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

### 4. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

## User Registration Flow

### Step 1: Access Registration Page

1. Open your browser and navigate to `http://localhost:5173/register`
2. You should see the registration form with:
   - Email input field
   - Password input field
   - Register button
   - Link to login page (if exists)

### Step 2: Fill Registration Form

1. **Enter Email**: Type a valid email address (e.g., `user@example.com`)
2. **Enter Password**: Type a strong password meeting these requirements:
   - At least 8 characters
   - At least 1 uppercase letter
   - At least 1 lowercase letter
   - At least 1 number
   - At least 1 special character

### Step 3: Real-time Validation

As you type, the form should show real-time validation:

**Email Validation**:
- ✅ Valid email format
- ❌ Invalid email format (shows error message)

**Password Validation**:
- ✅ Strong password (meets all requirements)
- ❌ Weak password (shows specific requirements not met)

### Step 4: Submit Registration

1. Click the "Register" button
2. The form should validate all fields
3. If valid, show loading state
4. Send registration request to backend

### Step 5: Handle Response

**Success (201)**:
- User account created successfully
- JWT token generated
- User automatically logged in
- Redirect to dashboard/home page
- Show success message

**Error (400/409)**:
- Display specific error message
- Keep form data for retry
- Allow user to correct errors

## API Testing

### Using curl

```bash
# Successful registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Expected response (201):
{
  "user": {
    "id": 1,
    "email": "test@example.com",
    "created_at": "2025-01-27T10:30:00Z"
  },
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using Postman

1. Create new POST request
2. URL: `http://localhost:3000/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "SecurePass123!"
}
```

## Test Scenarios

### Scenario 1: Valid Registration
1. Navigate to registration page
2. Enter valid email and strong password
3. Click register
4. Verify success message and redirect
5. Verify user is logged in

### Scenario 2: Invalid Email
1. Enter invalid email format
2. Verify real-time validation error
3. Try to submit
4. Verify error message appears

### Scenario 3: Weak Password
1. Enter weak password
2. Verify real-time validation shows requirements
3. Try to submit
4. Verify error message appears

### Scenario 4: Duplicate Email
1. Register with email `test@example.com`
2. Try to register again with same email
3. Verify error message about email already exists

### Scenario 5: Network Error
1. Disconnect internet
2. Try to register
3. Verify error message and retry option

## Troubleshooting

### Common Issues

**Backend not starting**:
- Check if port 3000 is available
- Verify Node.js version (18+)
- Check environment variables

**Frontend not connecting**:
- Verify backend is running
- Check API URL in frontend .env
- Check browser console for errors

**Database errors**:
- Verify database file permissions
- Check database migration status
- Verify SQLite installation

**Validation not working**:
- Check browser console for JavaScript errors
- Verify form component implementation
- Check API endpoint responses

### Debug Mode

**Backend**:
```bash
DEBUG=* npm run dev
```

**Frontend**:
```bash
VITE_DEBUG=true npm run dev
```

## Success Criteria

✅ User can access registration page  
✅ Form shows real-time validation  
✅ Valid registration creates user account  
✅ User is automatically logged in after registration  
✅ Error messages are clear and helpful  
✅ Form handles network errors gracefully  
✅ Password requirements are enforced  
✅ Email format validation works  
✅ Duplicate email prevention works  

## Next Steps

After successful registration:
1. User should be redirected to dashboard
2. JWT token should be stored securely
3. User should be able to access protected routes
4. User should be able to log out
5. User should be able to log back in

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation
3. Check the test cases for expected behavior
4. Contact the development team
