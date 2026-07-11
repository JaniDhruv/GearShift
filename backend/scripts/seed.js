/**
 * GearShift Database Seed Script
 * Idempotently populates MongoDB with demo users (Admin, Staff, User) and 20 sample vehicles.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const Vehicle = require('../src/models/vehicle.model');
const { hashPassword } = require('../src/utils/password.utils');
const logger = require('../src/utils/logger');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gearshift_dev';

const seedDatabase = async () => {
  try {
    logger.info(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB.');

    // Clear existing data for idempotency
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    logger.info('Cleared existing User and Vehicle collections.');

    const hashedPassword = await hashPassword('Password123!');

    // Create demo users
    const usersData = [
      {
        name: 'Admin User',
        email: 'admin@gearshift.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'Staff Member',
        email: 'staff@gearshift.com',
        password: hashedPassword,
        role: 'staff'
      },
      {
        name: 'Regular Customer',
        email: 'user@gearshift.com',
        password: hashedPassword,
        role: 'user'
      }
    ];

    const createdUsers = await User.insertMany(usersData);
    const adminUser = createdUsers.find(u => u.role === 'admin');
    logger.info(`Seeded ${createdUsers.length} demo users (Admin, Staff, User).`);

    // Create 20 sample vehicles
    const sampleVehicles = [
      { make: 'Honda', model: 'Civic', category: 'SEDAN', price: 24500, quantity: 12 },
      { make: 'Toyota', model: 'Camry', category: 'SEDAN', price: 26800, quantity: 8 },
      { make: 'BMW', model: '3 Series', category: 'LUXURY', price: 44000, quantity: 5 },
      { make: 'Mercedes-Benz', model: 'C-Class', category: 'LUXURY', price: 46000, quantity: 4 },
      { make: 'Audi', model: 'A4', category: 'LUXURY', price: 42500, quantity: 6 },
      { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 30500, quantity: 15 },
      { make: 'Honda', model: 'CR-V', category: 'SUV', price: 31000, quantity: 14 },
      { make: 'Ford', model: 'Explorer', category: 'SUV', price: 38500, quantity: 7 },
      { make: 'Ford', model: 'F-150', category: 'TRUCK', price: 41000, quantity: 10 },
      { make: 'Chevrolet', model: 'Silverado 1500', category: 'TRUCK', price: 40500, quantity: 9 },
      { make: 'Volkswagen', model: 'Golf GTI', category: 'HATCHBACK', price: 31500, quantity: 6 },
      { make: 'Mazda', model: 'Mazda3 Hatchback', category: 'HATCHBACK', price: 25500, quantity: 11 },
      { make: 'Porsche', model: '911 Carrera', category: 'SPORTS', price: 115000, quantity: 2 },
      { make: 'Ford', model: 'Mustang GT', category: 'SPORTS', price: 44500, quantity: 5 },
      { make: 'Chevrolet', model: 'Corvette Stingray', category: 'SPORTS', price: 68000, quantity: 3 },
      { make: 'Tesla', model: 'Model 3', category: 'ELECTRIC', price: 40000, quantity: 10 },
      { make: 'Tesla', model: 'Model Y', category: 'ELECTRIC', price: 45000, quantity: 12 },
      { make: 'Hyundai', model: 'Ioniq 5', category: 'ELECTRIC', price: 42000, quantity: 8 },
      { make: 'Toyota', model: 'Prius', category: 'HYBRID', price: 28000, quantity: 14 },
      { make: 'Honda', model: 'Accord Hybrid', category: 'HYBRID', price: 32500, quantity: 9 }
    ].map(vehicle => ({
      ...vehicle,
      createdBy: adminUser._id
    }));

    const createdVehicles = await Vehicle.insertMany(sampleVehicles);
    logger.info(`Seeded ${createdVehicles.length} sample vehicles across all categories.`);

    logger.info('Database seed completed successfully!');
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB.');
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
