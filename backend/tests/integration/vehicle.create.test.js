const { getTestAgent } = require('../helpers/app');
const { setupTestDB } = require('../helpers/database');

describe('Vehicle Creation Integration Test Suite (POST /api/vehicles)', () => {
  setupTestDB();

  const adminUser = {
    name: 'Admin Manager',
    email: 'admin.create@example.com',
    password: 'Password123!',
    role: 'admin'
  };

  const staffUser = {
    name: 'Staff Member',
    email: 'staff.create@example.com',
    password: 'Password123!',
    role: 'staff'
  };

  const standardUser = {
    name: 'Standard Customer',
    email: 'user.create@example.com',
    password: 'Password123!',
    role: 'user'
  };

  let adminToken;
  let staffToken;
  let userToken;

  beforeEach(async () => {
    // Register and login Admin
    await getTestAgent().post('/api/auth/register').send(adminUser);
    const adminRes = await getTestAgent().post('/api/auth/login').send({
      email: adminUser.email,
      password: adminUser.password
    });
    adminToken = adminRes.body.token;

    // Register and login Staff
    await getTestAgent().post('/api/auth/register').send(staffUser);
    const staffRes = await getTestAgent().post('/api/auth/login').send({
      email: staffUser.email,
      password: staffUser.password
    });
    staffToken = staffRes.body.token;

    // Register and login Standard User
    await getTestAgent().post('/api/auth/register').send(standardUser);
    const userRes = await getTestAgent().post('/api/auth/login').send({
      email: standardUser.email,
      password: standardUser.password
    });
    userToken = userRes.body.token;
  });

  const validVehiclePayload = {
    make: 'Honda',
    model: 'Civic',
    category: 'SEDAN',
    price: 24000,
    quantity: 10
  };

  describe('Successful Vehicle Creation (STAFF & ADMIN)', () => {
    it('should allow ADMIN to create a vehicle successfully and return 201 Created', async () => {
      const response = await getTestAgent()
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validVehiclePayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('vehicle');
      expect(response.body.vehicle).toHaveProperty('id');
      expect(response.body.vehicle).toHaveProperty('make', validVehiclePayload.make);
      expect(response.body.vehicle).toHaveProperty('model', validVehiclePayload.model);
      expect(response.body.vehicle).toHaveProperty('category', validVehiclePayload.category);
      expect(response.body.vehicle).toHaveProperty('price', validVehiclePayload.price);
      expect(response.body.vehicle).toHaveProperty('quantity', validVehiclePayload.quantity);
      expect(response.body.vehicle).toHaveProperty('createdBy');
    });

    it('should allow STAFF to create a vehicle successfully and return 201 Created', async () => {
      const response = await getTestAgent()
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${staffToken}`)
        .send(validVehiclePayload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('vehicle');
      expect(response.body.vehicle).toHaveProperty('make', validVehiclePayload.make);
    });
  });

  describe('Authorization & Authentication Restrictions', () => {
    it('should return 401 Unauthorized when authorization header is missing', async () => {
      const response = await getTestAgent()
        .post('/api/vehicles')
        .send(validVehiclePayload);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 Forbidden when standard user attempts to create a vehicle', async () => {
      const response = await getTestAgent()
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validVehiclePayload);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Validation Rules', () => {
    it('should return 400 Bad Request when required fields are missing', async () => {
      const response = await getTestAgent()
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ make: 'Honda' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 Bad Request when category is invalid', async () => {
      const response = await getTestAgent()
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...validVehiclePayload,
          category: 'FLYING_CAR'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 Bad Request when price is zero or negative', async () => {
      const response = await getTestAgent()
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...validVehiclePayload,
          price: -500
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
