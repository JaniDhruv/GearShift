const mongoose = require('mongoose');

/**
 * Helper to determine current MongoDB connection state string
 * @returns {string}
 */
const getDatabaseStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState] || 'disconnected';
};

/**
 * Health Check Service
 *
 * Clean Architecture Layer: Application Business Rules / Use Cases
 *
 * Responsibilities:
 * - Gather and compute system diagnostics and health status
 */
const getSystemHealth = () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  uptime: process.uptime(),
  environment: process.env.NODE_ENV || 'development',
  database: {
    status: getDatabaseStatus()
  }
});

module.exports = {
  getSystemHealth
};
