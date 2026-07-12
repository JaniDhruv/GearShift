const { getTestAgent } = require('../helpers/app');
const { setupTestDB } = require('../helpers/database');
const Vehicle = require('../../src/models/vehicle.model');
const mongoose = require('mongoose');

describe('Inventory Operations Integration Test Suite', () => {
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

  describe('POST /api/vehicles/:id/purchase', () => {
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

      it('should allow standard USER to record a sale and decrement vehicle quantity by 1', async () => {
        const response = await getTestAgent()
          .post(`/api/vehicles/${inStockVehicleId}/purchase`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('vehicle');
        expect(response.body.vehicle.quantity).toBe(4);
      });
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    describe('Successful Restocking (ADMIN Only)', () => {
      it('should allow ADMIN to restock an in-stock vehicle by a positive quantity', async () => {
        const response = await getTestAgent()
          .post(`/api/vehicles/${inStockVehicleId}/restock`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantity: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('vehicle');
        expect(response.body.vehicle).toHaveProperty('id', inStockVehicleId);
        expect(response.body.vehicle).toHaveProperty('quantity', 15);

        const dbVehicle = await Vehicle.findById(inStockVehicleId);
        expect(dbVehicle.quantity).toBe(15);
      });

      it('should allow ADMIN to restock an out-of-stock vehicle (quantity = 0)', async () => {
        const response = await getTestAgent()
          .post(`/api/vehicles/${outOfStockVehicleId}/restock`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantity: 3 });

        expect(response.status).toBe(200);
        expect(response.body.vehicle).toHaveProperty('quantity', 3);
      });
    });

    describe('Invalid Quantities Validation', () => {
      it('should return 400 Bad Request when restock quantity is 0', async () => {
        const response = await getTestAgent()
          .post(`/api/vehicles/${inStockVehicleId}/restock`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantity: 0 });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should return 400 Bad Request when restock quantity is negative', async () => {
        const response = await getTestAgent()
          .post(`/api/vehicles/${inStockVehicleId}/restock`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantity: -5 });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should return 400 Bad Request when restock quantity is missing or not a number', async () => {
        const response = await getTestAgent()
          .post(`/api/vehicles/${inStockVehicleId}/restock`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });
    });

    describe('Non-Existent Vehicles Scenarios', () => {
      it('should return 404 Not Found when restocking a non-existent vehicle ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const response = await getTestAgent()
          .post(`/api/vehicles/${nonExistentId}/restock`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantity: 5 });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
      });
    });

    describe('Authorization & Authentication Restrictions (ADMIN Only)', () => {
      it('should return 401 Unauthorized when authorization header is missing', async () => {
        const response = await getTestAgent()
          .post(`/api/vehicles/${inStockVehicleId}/restock`)
          .send({ quantity: 5 });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
      });

      it('should return 403 Forbidden when STAFF attempts to restock a vehicle', async () => {
        const response = await getTestAgent()
          .post(`/api/vehicles/${inStockVehicleId}/restock`)
          .set('Authorization', `Bearer ${staffToken}`)
          .send({ quantity: 5 });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error');
      });

      it('should return 403 Forbidden when standard user attempts to restock a vehicle', async () => {
        const response = await getTestAgent()
          .post(`/api/vehicles/${inStockVehicleId}/restock`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ quantity: 5 });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error');
      });
    });
  });
});
