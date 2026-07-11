const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../src/models/user.model');
const Vehicle = require('../../src/models/vehicle.model');

describe('Database Seed Script Integration Test Suite', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env.MONGODB_URI = uri;
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoServer.stop();
  });

  it('should idempotently seed demo users and sample vehicles', async () => {
    const seedDatabase = require('../../scripts/seed');
    await seedDatabase();

    // Re-connect since seedDatabase disconnects at the end
    await mongoose.connect(process.env.MONGODB_URI);

    const userCount = await User.countDocuments();
    const vehicleCount = await Vehicle.countDocuments();

    expect(userCount).toBe(3);
    expect(vehicleCount).toBe(20);

    const admin = await User.findOne({ email: 'admin@gearshift.com' });
    expect(admin).toBeDefined();
    expect(admin.role).toBe('admin');

    await mongoose.disconnect();
  });
});
