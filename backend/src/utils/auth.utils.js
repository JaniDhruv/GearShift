const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'gearshift_jwt_secret_development_key';
const JWT_EXPIRES_IN = '1d';

/**
 * Hashes a plaintext password.
 * @param {string} password
 * @returns {Promise<string>}
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plaintext password against a hashed password.
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

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
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  extractBearerToken,
  JWT_SECRET
};
