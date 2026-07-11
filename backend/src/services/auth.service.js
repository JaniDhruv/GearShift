const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/password.utils');
const { generateToken } = require('../utils/jwt.utils');

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
 * Registers a new user
 */
const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const createdUser = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  return sanitizeUser(createdUser);
};

/**
 * Authenticates a user and generates a JWT token
 */
const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const token = generateToken(user);

  return {
    token,
    user: sanitizeUser(user)
  };
};

module.exports = {
  registerUser,
  loginUser,
  sanitizeUser
};
