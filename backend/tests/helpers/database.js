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
 * Drop all collections in the in-memory database.
 * Called between tests to ensure a clean state.
 */
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

/**
 * Disconnect from the in-memory database and stop the server.
 * Called once after all tests in a suite to clean up resources.
 */
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = {
  connect,
  clearDatabase,
  closeDatabase
};
