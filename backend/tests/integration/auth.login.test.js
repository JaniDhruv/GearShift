const { getTestAgent } = require('../helpers/app');
const { setupTestDB } = require('../helpers/database');

describe('User Login Integration Test Suite (POST /api/auth/login)', () => {
  setupTestDB();

  const userData = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'Password123!',
    role: 'sales'
  };

  beforeEach(async () => {
    await getTestAgent()
      .post('/api/auth/register')
      .send(userData);
  });

  describe('Successful Authentication', () => {
    it('should authenticate valid credentials and return 200 OK along with JWT token and user info', async () => {
      const response = await getTestAgent()
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(10);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', userData.email.toLowerCase());
      expect(response.body.user).not.toHaveProperty('password');
    });
  });

  describe('Authentication Failure Scenarios', () => {
    it('should return 401 Unauthorized when password is invalid', async () => {
      const response = await getTestAgent()
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 Unauthorized when email is unknown', async () => {
      const response = await getTestAgent()
        .post('/api/auth/login')
        .send({
          email: 'unknown.user@example.com',
          password: userData.password
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 Bad Request when email or password is missing', async () => {
      const response = await getTestAgent()
        .post('/api/auth/login')
        .send({
          email: userData.email
          // missing password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
