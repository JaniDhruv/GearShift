/**
 * API Response Utility
 * Clean Architecture Layer: Interface Adapters / Shared Utilities
 * Standardizes API responses across all controllers while maintaining compatibility.
 */

const successResponse = (message = 'Success', data = null) => {
  const payload = {
    success: true,
    message,
    data
  };

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    Object.assign(payload, data);
  }

  return payload;
};

const errorResponse = (message = 'An error occurred', errors = null) => {
  const payload = {
    success: false,
    message,
    error: message
  };

  if (errors) {
    payload.errors = errors;
  }

  return payload;
};

const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json(successResponse(message, data));
};

const sendError = (res, statusCode = 500, message = 'An error occurred', errors = null) => {
  return res.status(statusCode).json(errorResponse(message, errors));
};

module.exports = {
  successResponse,
  errorResponse,
  sendSuccess,
  sendError
};
