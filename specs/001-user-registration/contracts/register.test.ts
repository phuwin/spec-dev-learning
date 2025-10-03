import request from 'supertest';
import { app } from '../../../../backend/src/app';

describe('POST /api/auth/register', () => {
  describe('Successful registration', () => {
    it('should register a new user with valid credentials', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('created_at');
      expect(typeof response.body.token).toBe('string');
    });
  });

  describe('Validation errors', () => {
    it('should return 400 for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'SecurePass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty(
        'code',
        'INVALID_EMAIL_FORMAT'
      );
      expect(response.body.error).toHaveProperty('message');
    });

    it('should return 400 for weak password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'weak',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'WEAK_PASSWORD');
      expect(response.body.error).toHaveProperty('message');
    });

    it('should return 400 for missing email', async () => {
      const userData = {
        password: 'SecurePass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return 400 for missing password', async () => {
      const userData = {
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });
  });

  describe('Business logic errors', () => {
    it('should return 409 for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'SecurePass123!',
      };

      // First registration should succeed
      await request(app).post('/api/auth/register').send(userData).expect(201);

      // Second registration with same email should fail
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty(
        'code',
        'EMAIL_ALREADY_EXISTS'
      );
      expect(response.body.error).toHaveProperty('message');
    });
  });

  describe('Password strength validation', () => {
    const testCases = [
      {
        password: 'short',
        description: 'too short',
      },
      {
        password: 'nouppercase123!',
        description: 'no uppercase letter',
      },
      {
        password: 'NOLOWERCASE123!',
        description: 'no lowercase letter',
      },
      {
        password: 'NoNumbers!',
        description: 'no numbers',
      },
      {
        password: 'NoSpecialChars123',
        description: 'no special characters',
      },
    ];

    testCases.forEach(({ password, description }) => {
      it(`should reject password that is ${description}`, async () => {
        const userData = {
          email: 'test@example.com',
          password,
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(400);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty('code', 'WEAK_PASSWORD');
      });
    });
  });

  describe('Email validation', () => {
    const invalidEmails = [
      'not-an-email',
      '@example.com',
      'user@',
      'user@.com',
      'user..name@example.com',
      'user@example..com',
    ];

    invalidEmails.forEach((email) => {
      it(`should reject invalid email: ${email}`, async () => {
        const userData = {
          email,
          password: 'SecurePass123!',
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(400);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toHaveProperty(
          'code',
          'INVALID_EMAIL_FORMAT'
        );
      });
    });
  });
});
