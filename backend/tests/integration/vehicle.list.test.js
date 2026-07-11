const { getTestAgent } = require('../helpers/app');
const { setupTestDB } = require('../helpers/database');
const Vehicle = require('../../src/models/vehicle.model');
const mongoose = require('mongoose');

describe('Inventory Retrieval Integration Test Suite (GET /api/vehicles)', () => {
  setupTestDB();

  describe('Empty Inventory Response', () => {
    it('should return 200 OK along with an empty vehicles array when no vehicles exist', async () => {
      const response = await getTestAgent().get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('vehicles');
      expect(Array.isArray(response.body.vehicles)).toBe(true);
      expect(response.body.vehicles.length).toBe(0);
    });
  });

  describe('Successful Retrieval of Vehicles & Response Structure', () => {
    it('should return 200 OK along with all existing vehicles formatted as clean DTOs', async () => {
      // Seed two vehicle documents
      const vehicle1 = await Vehicle.create({
        make: 'Toyota',
        model: 'Corolla',
        category: 'SEDAN',
        price: 22000,
        quantity: 5,
        createdBy: new mongoose.Types.ObjectId()
      });

      const vehicle2 = await Vehicle.create({
        make: 'Ford',
        model: 'Explorer',
        category: 'SUV',
        price: 35000,
        quantity: 3,
        createdBy: new mongoose.Types.ObjectId()
      });

      const response = await getTestAgent().get('/api/vehicles');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('vehicles');
      expect(Array.isArray(response.body.vehicles)).toBe(true);
      expect(response.body.vehicles.length).toBe(2);

      // Verify structure of first vehicle DTO
      const firstVehicle = response.body.vehicles.find((v) => v.id === vehicle1._id.toString());
      expect(firstVehicle).toBeDefined();
      expect(firstVehicle).toHaveProperty('make', 'Toyota');
      expect(firstVehicle).toHaveProperty('model', 'Corolla');
      expect(firstVehicle).toHaveProperty('category', 'SEDAN');
      expect(firstVehicle).toHaveProperty('price', 22000);
      expect(firstVehicle).toHaveProperty('quantity', 5);
      expect(firstVehicle).toHaveProperty('createdAt');
      expect(firstVehicle).toHaveProperty('updatedAt');
    });
  });
});
