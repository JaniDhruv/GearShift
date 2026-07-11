const { getTestAgent } = require('../helpers/app');
const { setupTestDB } = require('../helpers/database');
const Vehicle = require('../../src/models/vehicle.model');
const mongoose = require('mongoose');

describe('Inventory Operations Integration Test Suite (POST /api/vehicles/:id/purchase)', () => {
  setupTestDB();

  const adminUser = {
    name: 'Admin Manager',
    email: 'admin.inventory@example.com',
    password: 'Password123!',
    role: 'admin'
  };

  const staffUser = {
    name: 'Staff Member',
    email: 'staff.inventory@example.com',
    password: 'Password123!',
    role: 'staff'
  };

  const standardUser = {
    name: 'Standard Customer',
    email: 'user.inventory@example.com',
    password: 'Password123!',
    role: 'user'
  };

  let adminToken;
  let staffToken;
  let userToken;
  let inStockVehicleId;
  let outOfStockVehicleId;

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

    // Seed an in-stock vehicle
    const vehicle1 = await Vehicle.create({
      make: 'Toyota',
      model: 'Hilux',
      category: 'TRUCK',
      price: 40000,
      quantity: 5,
      createdBy: new mongoose.Types.ObjectId()
    });
    inStockVehicleId = vehicle1._id.toString();

    // Seed an out-of-stock vehicle
    const vehicle2 = await Vehicle.create({
      make: 'Porsche',
      model: '911',
      category: 'SPORTS',
      price: 120000,
      quantity: 0,
      createdBy: new mongoose.Types.ObjectId()
    });
    outOfStockVehicleId = vehicle2._id.toString();
  });

  describe('Successful Inventory Reduction (STAFF & ADMIN)', () => {
    it('should allow ADMIN to record a sale and decrement vehicle quantity by 1', async () => {
      const response = await getTestAgent()
        .post(`/api/vehicles/${inStockVehicleId}/purchase`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('vehicle');
      expect(response.body.vehicle).toHaveProperty('id', inStockVehicleId);
      expect(response.body.vehicle).toHaveProperty('quantity', 4);

      const dbVehicle = await Vehicle.findById(inStockVehicleId);
      expect(dbVehicle.quantity).toBe(4);
    });

    it('should allow STAFF to record a sale and decrement vehicle quantity by 1', async () => {
      const response = await getTestAgent()
        .post(`/api/vehicles/${inStockVehicleId}/purchase`)
        .set('Authorization', `Bearer ${staffToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('vehicle');
      expect(response.body.vehicle).toHaveProperty('quantity', 4);
    });
  });

  describe('Business Rule Validation (Out of Stock)', () => {
    it('should return 400 Bad Request when attempting to purchase an out-of-stock vehicle', async () => {
      const response = await getTestAgent()
        .post(`/api/vehicles/${outOfStockVehicleId}/purchase`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Invalid Identifiers & Not Found Scenarios', () => {
    it('should return 404 Not Found when recording a sale for a non-existent vehicle ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const response = await getTestAgent()
        .post(`/api/vehicles/${nonExistentId}/purchase`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 Bad Request when vehicle ID format is invalid', async () => {
      const response = await getTestAgent()
        .post('/api/vehicles/invalid-id-format/purchase')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Authorization & Authentication Restrictions', () => {
    it('should return 401 Unauthorized when authorization header is missing', async () => {
      const response = await getTestAgent()
        .post(`/api/vehicles/${inStockVehicleId}/purchase`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 Forbidden when standard user attempts to record a sale', async () => {
      const response = await getTestAgent()
        .post(`/api/vehicles/${inStockVehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });
});
