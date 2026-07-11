const { getTestAgent } = require('../helpers/app');
const { setupTestDB } = require('../helpers/database');
const Vehicle = require('../../src/models/vehicle.model');
const mongoose = require('mongoose');

describe('Vehicle Update Integration Test Suite (PUT /api/vehicles/:id)', () => {
  setupTestDB();

  const adminUser = {
    name: 'Admin Manager',
    email: 'admin.update@example.com',
    password: 'Password123!',
    role: 'admin'
  };

  const staffUser = {
    name: 'Staff Member',
    email: 'staff.update@example.com',
    password: 'Password123!',
    role: 'staff'
  };

  const standardUser = {
    name: 'Standard Customer',
    email: 'user.update@example.com',
    password: 'Password123!',
    role: 'user'
  };

  let adminToken;
  let staffToken;
  let userToken;
  let existingVehicleId;

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

    // Seed an existing vehicle
    const vehicle = await Vehicle.create({
      make: 'Toyota',
      model: 'Camry',
      category: 'SEDAN',
      price: 26000,
      quantity: 10,
      createdBy: new mongoose.Types.ObjectId()
    });
    existingVehicleId = vehicle._id.toString();
  });

  const validUpdatePayload = {
    make: 'Toyota',
    model: 'Camry Hybrid',
    category: 'HYBRID',
    price: 28500,
    quantity: 12
  };

  describe('Successful Vehicle Updates (STAFF & ADMIN)', () => {
    it('should allow ADMIN to update an existing vehicle successfully and return 200 OK', async () => {
      const response = await getTestAgent()
        .put(`/api/vehicles/${existingVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validUpdatePayload);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('vehicle');
      expect(response.body.vehicle).toHaveProperty('id', existingVehicleId);
      expect(response.body.vehicle).toHaveProperty('model', 'Camry Hybrid');
      expect(response.body.vehicle).toHaveProperty('category', 'HYBRID');
      expect(response.body.vehicle).toHaveProperty('price', 28500);
      expect(response.body.vehicle).toHaveProperty('quantity', 12);
    });

    it('should allow STAFF to update an existing vehicle successfully and return 200 OK', async () => {
      const response = await getTestAgent()
        .put(`/api/vehicles/${existingVehicleId}`)
        .set('Authorization', `Bearer ${staffToken}`)
        .send(validUpdatePayload);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('vehicle');
      expect(response.body.vehicle).toHaveProperty('model', 'Camry Hybrid');
    });
  });

  describe('Invalid Identifiers & Not Found Scenarios', () => {
    it('should return 404 Not Found when updating a non-existent vehicle ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const response = await getTestAgent()
        .put(`/api/vehicles/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validUpdatePayload);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 Bad Request when vehicle ID format is invalid', async () => {
      const response = await getTestAgent()
        .put('/api/vehicles/invalid-id-format')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validUpdatePayload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Authorization & Authentication Restrictions', () => {
    it('should return 401 Unauthorized when authorization header is missing', async () => {
      const response = await getTestAgent()
        .put(`/api/vehicles/${existingVehicleId}`)
        .send(validUpdatePayload);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 Forbidden when standard user attempts to update a vehicle', async () => {
      const response = await getTestAgent()
        .put(`/api/vehicles/${existingVehicleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(validUpdatePayload);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Validation Failures', () => {
    it('should return 400 Bad Request when update payload has invalid price', async () => {
      const response = await getTestAgent()
        .put(`/api/vehicles/${existingVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...validUpdatePayload,
          price: -100
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
