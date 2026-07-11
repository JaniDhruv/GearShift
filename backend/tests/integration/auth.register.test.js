const { getTestAgent } = require('../helpers/app');
const { setupTestDB } = require('../helpers/database');

describe('User Registration Integration Test Suite (POST /api/auth/register)', () => {
  setupTestDB();

  const validUserData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'Password123!'
  };

  describe('Successful Registration', () => {
    it('should register a new user successfully and return 201 Created without password', async () => {
      const response = await getTestAgent()
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('name', validUserData.name);
      expect(response.body.user).toHaveProperty('email', validUserData.email.toLowerCase());
      expect(response.body.user).toHaveProperty('role');
      expect(response.body.user).not.toHaveProperty('password');
    });
  });

  describe('Validation & Duplicate Scenarios', () => {
    it('should return 409 Conflict when registering with a duplicate email', async () => {
      await getTestAgent()
        .post('/api/auth/register')
        .send(validUserData);

      const duplicateResponse = await getTestAgent()
        .post('/api/auth/register')
        .send(validUserData);

      expect(duplicateResponse.status).toBe(409);
      expect(duplicateResponse.body).toHaveProperty('error');
    });

    it('should return 400 Bad Request when email format is invalid', async () => {
      const response = await getTestAgent()
        .post('/api/auth/register')
        .send({
          ...validUserData,
          email: 'invalid-email-format'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 Bad Request when required fields are missing', async () => {
      const response = await getTestAgent()
        .post('/api/auth/register')
        .send({
          name: 'John Doe'
          // missing email and password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 Bad Request when password is weak (less than 6 characters)', async () => {
      const response = await getTestAgent()
        .post('/api/auth/register')
        .send({
          ...validUserData,
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
