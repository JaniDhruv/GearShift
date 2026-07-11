const { getTestAgent } = require('../helpers/app');
const { setupTestDB } = require('../helpers/database');
const Vehicle = require('../../src/models/vehicle.model');
const mongoose = require('mongoose');

describe('Vehicle Deletion Integration Test Suite (DELETE /api/vehicles/:id)', () => {
  setupTestDB();

  const adminUser = {
    name: 'Admin Manager',
    email: 'admin.delete@example.com',
    password: 'Password123!',
    role: 'admin'
  };

  const staffUser = {
    name: 'Staff Member',
    email: 'staff.delete@example.com',
    password: 'Password123!',
    role: 'staff'
  };

  const standardUser = {
    name: 'Standard Customer',
    email: 'user.delete@example.com',
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
      make: 'Ford',
      model: 'Mustang',
      category: 'SPORTS',
      price: 45000,
      quantity: 4,
      createdBy: new mongoose.Types.ObjectId()
    });
    existingVehicleId = vehicle._id.toString();
  });

  describe('Successful Vehicle Deletion (ADMIN Only)', () => {
    it('should allow ADMIN to delete an existing vehicle successfully and return 200 OK', async () => {
      const response = await getTestAgent()
        .delete(`/api/vehicles/${existingVehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify vehicle is removed from database
      const dbVehicle = await Vehicle.findById(existingVehicleId);
      expect(dbVehicle).toBeNull();
    });
  });

  describe('Authorization & Authentication Restrictions', () => {
    it('should return 401 Unauthorized when authorization header is missing', async () => {
      const response = await getTestAgent()
        .delete(`/api/vehicles/${existingVehicleId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 Forbidden when STAFF attempts to delete a vehicle', async () => {
      const response = await getTestAgent()
        .delete(`/api/vehicles/${existingVehicleId}`)
        .set('Authorization', `Bearer ${staffToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 Forbidden when standard USER attempts to delete a vehicle', async () => {
      const response = await getTestAgent()
        .delete(`/api/vehicles/${existingVehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Invalid Identifiers & Not Found Scenarios', () => {
    it('should return 404 Not Found when deleting a non-existent vehicle ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const response = await getTestAgent()
        .delete(`/api/vehicles/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 Bad Request when vehicle ID format is invalid', async () => {
      const response = await getTestAgent()
        .delete('/api/vehicles/invalid-id-format')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
