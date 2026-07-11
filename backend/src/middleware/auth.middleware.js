const userRepository = require('../repositories/user.repository');
const { sanitizeUser } = require('../services/auth.service');
const { extractBearerToken, verifyToken } = require('../utils/auth.utils');

/**
 * JWT Authentication Middleware
 * Clean Architecture Layer: Interface Adapters (Security Middleware)
 */
const authenticateJWT = async (req, res, next) => {
  const token = extractBearerToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    const payload = verifyToken(token);
    const existingUser = await userRepository.findById(payload.id);

    if (!existingUser) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = sanitizeUser(existingUser);
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};

module.exports = {
  authenticateJWT
};
