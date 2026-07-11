const mongoose = require('mongoose');

const CONNECTION_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting'
};

/**
 * Retrieves the current database connection state string.
 *
 * @returns {string} 'connected' | 'disconnected' | 'connecting' | 'disconnecting'
 */
const getDatabaseConnectionStatus = () => {
  return CONNECTION_STATES[mongoose.connection.readyState] || 'disconnected';
};

module.exports = {
  getDatabaseConnectionStatus
};
