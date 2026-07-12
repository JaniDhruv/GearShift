const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gearshift_jwt_secret_development_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Generates a signed JWT token for a user.
 * @param {Object} user
 * @returns {string}
 */
const generateToken = (user) => {
  const payload = {
    id: user._id ? user._id.toString() : user.id,
    role: user.role
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifies and decodes a JWT token.
 * @param {string} token
 * @returns {Object} decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Extracts a Bearer token string from an HTTP request header.
 * @param {Object} req
 * @returns {string|null} token string or null if missing/malformed
 */
const extractBearerToken = (req) => {
  const authHeader = req.headers && req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

module.exports = {
  generateToken,
  verifyToken,
  extractBearerToken,
  JWT_SECRET
};
