const healthService = require('../services/health.service');

/**
 * Health Check Controller
 *
 * Clean Architecture Layer: Interface Adapters (Controllers)
 *
 * Responsibilities:
 * - Handle HTTP request/response lifecycle for system diagnostics
 * - Delegate health diagnostic queries to the application service layer
 */
const getHealthStatus = (req, res, next) => {
  try {
    const healthData = healthService.getSystemHealth();
    return res.status(200).json(healthData);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getHealthStatus
};
