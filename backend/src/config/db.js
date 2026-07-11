const mongoose = require('mongoose');

/**
 * Connects to MongoDB database using Mongoose.
 * Supports environment-driven connection URIs for production and testing environments.
 *
 * @param {string} [customUri] - Optional override URI (useful for unit/integration tests)
 * @returns {Promise<mongoose.Connection>}
 */
const connectDB = async (customUri) => {
  const uri = customUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/gearshift_inventory';

  try {
    const connection = await mongoose.connect(uri);

    if (process.env.NODE_ENV !== 'test') {
      console.log(`MongoDB Connected: ${connection.connection.host}`);
    }

    return connection;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

/**
 * Disconnects from MongoDB database.
 * Essential for graceful shutdown and cleanup after testing.
 *
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB Disconnected');
    }
  }
};

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn('MongoDB connection lost');
  }
});

module.exports = {
  connectDB,
  disconnectDB,
};
