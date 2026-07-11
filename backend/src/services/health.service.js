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
  environment: process.env.NODE_ENV || 'development'
});

module.exports = {
  getSystemHealth
};
