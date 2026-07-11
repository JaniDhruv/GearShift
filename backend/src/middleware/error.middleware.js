const logger = require('../utils/logger');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Global Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  logger.error(err.message, {
    statusCode,
    url: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  const payload = errorResponse(err.message || 'Internal Server Error', err.errors);
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;
