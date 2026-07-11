const { getTestAgent } = require('../../helpers/app');
const { setupTestDB } = require('../../helpers/database');

describe('Role-Based Access Control (RBAC) Integration Test Suite', () => {
  setupTestDB();

  const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Password123!',
    role: 'admin'
  };

  const staffUser = {
    name: 'Staff User',
    email: 'staff@example.com',
    password: 'Password123!',
    role: 'staff'
  };

  const standardUser = {
    name: 'Standard User',
    email: 'user@example.com',
    password: 'Password123!',
    role: 'user'
  };

  let adminToken;
  let staffToken;
  let userToken;

  beforeEach(async () => {
    // Register and login Admin
    await getTestAgent().post('/api/auth/register').send(adminUser);
    const adminLogin = await getTestAgent().post('/api/auth/login').send({
      email: adminUser.email,
      password: adminUser.password
    });
    adminToken = adminLogin.body.token;

    // Register and login Staff
    await getTestAgent().post('/api/auth/register').send(staffUser);
    const staffLogin = await getTestAgent().post('/api/auth/login').send({
      email: staffUser.email,
      password: staffUser.password
    });
    staffToken = staffLogin.body.token;

    // Register and login Standard User
    await getTestAgent().post('/api/auth/register').send(standardUser);
    const userLogin = await getTestAgent().post('/api/auth/login').send({
      email: standardUser.email,
      password: standardUser.password
    });
    userToken = userLogin.body.token;
  });

  describe('Administrator Access (Admin Only Route)', () => {
    it('should allow access to admin user on admin-only route and return 200 OK', async () => {
      const response = await getTestAgent()
        .get('/api/rbac-test/admin-only')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Admin access granted');
    });

    it('should deny access to staff user on admin-only route with 403 Forbidden', async () => {
      const response = await getTestAgent()
        .get('/api/rbac-test/admin-only')
        .set('Authorization', `Bearer ${staffToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should deny access to standard user on admin-only route with 403 Forbidden', async () => {
      const response = await getTestAgent()
        .get('/api/rbac-test/admin-only')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Staff & Admin Access (Staff Or Admin Route)', () => {
    it('should allow access to staff user on staff-or-admin route and return 200 OK', async () => {
      const response = await getTestAgent()
        .get('/api/rbac-test/staff-or-admin')
        .set('Authorization', `Bearer ${staffToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Staff or Admin access granted');
    });

    it('should allow access to admin user on staff-or-admin route and return 200 OK', async () => {
      const response = await getTestAgent()
        .get('/api/rbac-test/staff-or-admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Staff or Admin access granted');
    });

    it('should return 403 Forbidden for standard user on staff-or-admin route due to insufficient permissions', async () => {
      const response = await getTestAgent()
        .get('/api/rbac-test/staff-or-admin')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Missing Authentication & Unauthenticated Requests', () => {
    it('should return 401 Unauthorized when authorization header is missing on protected route', async () => {
      const response = await getTestAgent()
        .get('/api/rbac-test/admin-only');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
