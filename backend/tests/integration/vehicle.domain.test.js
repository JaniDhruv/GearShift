const mongoose = require('mongoose');
const { setupTestDB } = require('../helpers/database');
const Vehicle = require('../../src/models/vehicle.model');

describe('Vehicle Domain Model Validation Integration Test Suite', () => {
  setupTestDB();

  const validVehicleData = {
    make: 'Toyota',
    model: 'Camry',
    category: 'SEDAN',
    price: 26000,
    quantity: 15,
    createdBy: new mongoose.Types.ObjectId()
  };

  describe('Successful Vehicle Creation', () => {
    it('should create and save a vehicle successfully with valid attributes and timestamps', async () => {
      const vehicle = new Vehicle(validVehicleData);
      const savedVehicle = await vehicle.save();

      expect(savedVehicle._id).toBeDefined();
      expect(savedVehicle.make).toBe(validVehicleData.make);
      expect(savedVehicle.model).toBe(validVehicleData.model);
      expect(savedVehicle.category).toBe(validVehicleData.category);
      expect(savedVehicle.price).toBe(validVehicleData.price);
      expect(savedVehicle.quantity).toBe(validVehicleData.quantity);
      expect(savedVehicle.createdBy.toString()).toBe(validVehicleData.createdBy.toString());
      expect(savedVehicle.createdAt).toBeDefined();
      expect(savedVehicle.updatedAt).toBeDefined();
    });
  });

  describe('Required Fields Validation', () => {
    it('should fail validation when required fields are missing', async () => {
      const vehicle = new Vehicle({});

      let err;
      try {
        await vehicle.validate();
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.errors.make).toBeDefined();
      expect(err.errors.model).toBeDefined();
      expect(err.errors.category).toBeDefined();
      expect(err.errors.price).toBeDefined();
      expect(err.errors.quantity).toBeDefined();
      expect(err.errors.createdBy).toBeDefined();
    });
  });

  describe('Category Enum Validation', () => {
    it('should accept valid categories (SEDAN, SUV, HATCHBACK, TRUCK, SPORTS, LUXURY, ELECTRIC, HYBRID)', async () => {
      const vehicle = new Vehicle({
        ...validVehicleData,
        category: 'SUV'
      });
      await expect(vehicle.validate()).resolves.toBeUndefined();
    });

    it('should fail validation when category is invalid', async () => {
      const vehicle = new Vehicle({
        ...validVehicleData,
        category: 'INVALID_CATEGORY'
      });

      let err;
      try {
        await vehicle.validate();
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.errors.category).toBeDefined();
    });
  });

  describe('Price Validation (Positive Number)', () => {
    it('should fail validation when price is zero or negative', async () => {
      const zeroPriceVehicle = new Vehicle({
        ...validVehicleData,
        price: 0
      });

      const negativePriceVehicle = new Vehicle({
        ...validVehicleData,
        price: -1500
      });

      await expect(zeroPriceVehicle.validate()).rejects.toThrow();
      await expect(negativePriceVehicle.validate()).rejects.toThrow();
    });
  });

  describe('Quantity Validation (Non-Negative Integer)', () => {
    it('should allow zero quantity (out of stock)', async () => {
      const outOfStockVehicle = new Vehicle({
        ...validVehicleData,
        quantity: 0
      });
      await expect(outOfStockVehicle.validate()).resolves.toBeUndefined();
    });

    it('should fail validation when quantity is negative', async () => {
      const negativeQtyVehicle = new Vehicle({
        ...validVehicleData,
        quantity: -5
      });

      await expect(negativeQtyVehicle.validate()).rejects.toThrow();
    });
  });
});
