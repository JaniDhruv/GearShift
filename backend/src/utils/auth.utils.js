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

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  JWT_SECRET
};
