const jwt = require('jsonwebtoken');
const { getTestAgent } = require('../helpers/app');
const { setupTestDB } = require('../helpers/database');
const { JWT_SECRET } = require('../../src/utils/jwt.utils');

describe('JWT Authentication Middleware Integration Test Suite (GET /api/auth/me)', () => {
  setupTestDB();

  const userData = {
    name: 'Protected User',
    email: 'protected@example.com',
    password: 'Password123!',
    role: 'manager'
  };

  let validToken;

  beforeEach(async () => {
    await getTestAgent()
      .post('/api/auth/register')
      .send(userData);

    const loginResponse = await getTestAgent()
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    validToken = loginResponse.body.token;
  });

  describe('Valid Authentication', () => {
    it('should allow access to protected route with a valid Bearer token and return current user', async () => {
      const response = await getTestAgent()
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userData.email.toLowerCase());
      expect(response.body.user).toHaveProperty('role', userData.role);
    });
  });

  describe('Unauthorized Scenarios', () => {
    it('should return 401 Unauthorized when Authorization header is missing', async () => {
      const response = await getTestAgent()
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 Unauthorized when token format or signature is invalid', async () => {
      const response = await getTestAgent()
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.string');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 Unauthorized when JWT token is expired', async () => {
      const expiredToken = jwt.sign(
        { id: '507f1f77bcf86cd799439011', role: 'sales' },
        JWT_SECRET,
        { expiresIn: '-10s' }
      );

      const response = await getTestAgent()
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
