const { getTestAgent } = require('../helpers/app');
const { setupTestDB } = require('../helpers/database');
const Vehicle = require('../../src/models/vehicle.model');
const mongoose = require('mongoose');

describe('Inventory Discovery Integration Test Suite (GET /api/vehicles/search)', () => {
  setupTestDB();

  beforeEach(async () => {
    // Seed 4 distinct vehicles for discovery
    await Vehicle.create([
      {
        make: 'Toyota',
        model: 'Camry',
        category: 'SEDAN',
        price: 26000,
        quantity: 10,
        createdBy: new mongoose.Types.ObjectId()
      },
      {
        make: 'Toyota',
        model: 'RAV4',
        category: 'SUV',
        price: 32000,
        quantity: 5,
        createdBy: new mongoose.Types.ObjectId()
      },
      {
        make: 'Ford',
        model: 'Explorer',
        category: 'SUV',
        price: 45000,
        quantity: 3,
        createdBy: new mongoose.Types.ObjectId()
      },
      {
        make: 'Tesla',
        model: 'Model 3',
        category: 'ELECTRIC',
        price: 38000,
        quantity: 7,
        createdBy: new mongoose.Types.ObjectId()
      }
    ]);
  });

  describe('Single Filter Queries', () => {
    it('should filter vehicles by make (case-insensitive) and return matching vehicles', async () => {
      const response = await getTestAgent().get('/api/vehicles/search?make=toyota');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('vehicles');
      expect(Array.isArray(response.body.vehicles)).toBe(true);
      expect(response.body.vehicles.length).toBe(2);
      expect(response.body.vehicles.every((v) => v.make.toLowerCase() === 'toyota')).toBe(true);
    });

    it('should filter vehicles by model (case-insensitive) and return matching vehicles', async () => {
      const response = await getTestAgent().get('/api/vehicles/search?model=camry');

      expect(response.status).toBe(200);
      expect(response.body.vehicles.length).toBe(1);
      expect(response.body.vehicles[0]).toHaveProperty('model', 'Camry');
    });

    it('should filter vehicles by category and return matching vehicles', async () => {
      const response = await getTestAgent().get('/api/vehicles/search?category=SUV');

      expect(response.status).toBe(200);
      expect(response.body.vehicles.length).toBe(2);
      expect(response.body.vehicles.every((v) => v.category === 'SUV')).toBe(true);
    });

    it('should filter vehicles by minPrice and return vehicles with price >= minPrice', async () => {
      const response = await getTestAgent().get('/api/vehicles/search?minPrice=35000');

      expect(response.status).toBe(200);
      expect(response.body.vehicles.length).toBe(2);
      expect(response.body.vehicles.every((v) => v.price >= 35000)).toBe(true);
    });

    it('should filter vehicles by maxPrice and return vehicles with price <= maxPrice', async () => {
      const response = await getTestAgent().get('/api/vehicles/search?maxPrice=30000');

      expect(response.status).toBe(200);
      expect(response.body.vehicles.length).toBe(1);
      expect(response.body.vehicles[0]).toHaveProperty('make', 'Toyota');
      expect(response.body.vehicles[0]).toHaveProperty('model', 'Camry');
    });
  });

  describe('Combined Filters & Price Ranges', () => {
    it('should filter vehicles within a price range (minPrice and maxPrice)', async () => {
      const response = await getTestAgent().get('/api/vehicles/search?minPrice=30000&maxPrice=40000');

      expect(response.status).toBe(200);
      expect(response.body.vehicles.length).toBe(2);
      expect(response.body.vehicles.every((v) => v.price >= 30000 && v.price <= 40000)).toBe(true);
    });

    it('should support combined filters (make and category)', async () => {
      const response = await getTestAgent().get('/api/vehicles/search?make=Toyota&category=SUV');

      expect(response.status).toBe(200);
      expect(response.body.vehicles.length).toBe(1);
      expect(response.body.vehicles[0]).toHaveProperty('make', 'Toyota');
      expect(response.body.vehicles[0]).toHaveProperty('model', 'RAV4');
    });
  });

  describe('Empty Results Scenarios', () => {
    it('should return 200 OK along with an empty array when no vehicles match the search criteria', async () => {
      const response = await getTestAgent().get('/api/vehicles/search?make=Ferrari');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('vehicles');
      expect(Array.isArray(response.body.vehicles)).toBe(true);
      expect(response.body.vehicles.length).toBe(0);
    });
  });
});
