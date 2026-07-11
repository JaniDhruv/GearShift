/**
 * Health Check Controller
 *
 * Clean Architecture Layer: Interface Adapters (Controllers)
 */
const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};
