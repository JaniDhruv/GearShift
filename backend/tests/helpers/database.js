const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to an in-memory MongoDB instance.
 * Called once before all tests in a suite to provide an isolated database.
 */
const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

/**
 * Drop all documents from every collection in the in-memory database.
 * Called between tests to ensure each test starts with a clean state.
 */
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

/**
 * Disconnect from the in-memory database and stop the server.
 * Called once after all tests in a suite to release resources.
 */
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

/**
 * Register Jest lifecycle hooks for database setup and teardown.
 *
 * Call this once at the top of any integration test suite that requires
 * a database connection. It automatically:
 *   - beforeAll:  spins up MongoMemoryServer and connects Mongoose
 *   - afterEach:  clears all collections between tests
 *   - afterAll:   drops the database, disconnects, and stops the server
 *
 * @example
 *   const { setupTestDB } = require('../helpers/database');
 *   setupTestDB();
 */
const setupTestDB = () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });
};

module.exports = {
  connect,
  clearDatabase,
  closeDatabase,
  setupTestDB
};
