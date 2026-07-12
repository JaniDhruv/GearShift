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

    // Create 20 sample vehicles (Indian Market, prices in INR Ex-Showroom)
    const sampleVehicles = [
      { make: 'Tata', model: 'Nexon', category: 'SUV', price: 1150000, quantity: 15 },
      { make: 'Mahindra', model: 'XUV700', category: 'SUV', price: 2450000, quantity: 8 },
      { make: 'Mahindra', model: 'Thar', category: 'SUV', price: 1680000, quantity: 3 },
      { make: 'Maruti Suzuki', model: 'Swift', category: 'HATCHBACK', price: 780000, quantity: 20 },
      { make: 'Hyundai', model: 'Creta', category: 'SUV', price: 1520000, quantity: 12 },
      { make: 'Tata', model: 'Harrier', category: 'SUV', price: 2190000, quantity: 5 },
      { make: 'Kia', model: 'Seltos', category: 'SUV', price: 1650000, quantity: 9 },
      { make: 'Toyota', model: 'Innova Hycross', category: 'HYBRID', price: 3090000, quantity: 6 },
      { make: 'Tata', model: 'Tiago EV', category: 'ELECTRIC', price: 899000, quantity: 14 },
      { make: 'MG', model: 'ZS EV', category: 'ELECTRIC', price: 2498000, quantity: 2 },
      { make: 'Skoda', model: 'Slavia', category: 'SEDAN', price: 1489000, quantity: 7 },
      { make: 'Volkswagen', model: 'Virtus GT', category: 'SEDAN', price: 1895000, quantity: 4 },
      { make: 'Honda', model: 'City Hybrid e:HEV', category: 'HYBRID', price: 2055000, quantity: 10 },
      { make: 'Mahindra', model: 'Scorpio-N', category: 'SUV', price: 1985000, quantity: 0 },
      { make: 'Maruti Suzuki', model: 'Brezza', category: 'SUV', price: 1120000, quantity: 18 },
      { make: 'Hyundai', model: 'Verna Turbo', category: 'SEDAN', price: 1625000, quantity: 6 },
      { make: 'Toyota', model: 'Hilux', category: 'TRUCK', price: 3790000, quantity: 3 },
      { make: 'BMW', model: 'M340i xDrive', category: 'SPORTS', price: 7290000, quantity: 2 },
      { make: 'Mercedes-Benz', model: 'E-Class E350d', category: 'LUXURY', price: 8850000, quantity: 4 },
      { make: 'BYD', model: 'Seal AWD', category: 'ELECTRIC', price: 5300000, quantity: 5 }
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
