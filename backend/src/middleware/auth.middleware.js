const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const { sanitizeUser } = require('../services/auth.service');
const { JWT_SECRET } = require('../utils/auth.utils');

/**
 * JWT Authentication Middleware
 * Clean Architecture Layer: Interface Adapters (Security Middleware)
 */
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
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
