const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');

const SALT_ROUNDS = 10;

/**
 * Transforms a User document into a safe client DTO without password
 * @param {Object} user
 * @returns {Object}
 */
const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
});

/**
 * Auth Service
 * Clean Architecture Layer: Application Business Rules
 */
const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const createdUser = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  return sanitizeUser(createdUser);
};

module.exports = {
  registerUser,
  sanitizeUser
};
