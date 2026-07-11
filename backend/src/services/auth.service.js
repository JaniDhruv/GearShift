const userRepository = require('../repositories/user.repository');
const { hashPassword, comparePassword } = require('../utils/password.utils');
const { generateToken } = require('../utils/jwt.utils');
const { AppError, UnauthorizedError } = require('../errors');

/**
 * Transforms a User document into a safe client DTO without sensitive fields
 * @param {Object} user - Raw MongoDB User document
 * @returns {Object} Safe User DTO
 */
const sanitizeUser = (user) => ({
  id: user._id ? user._id.toString() : user.id,
  name: user.name,
  email: user.email,
  role: user.role
});

/**
 * Registers a new user account with secure password hashing
 * @throws {AppError} 409 if email already exists
 */
const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
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
 * Authenticates user credentials and issues a signed JWT
 * @throws {UnauthorizedError} 401 if credentials are invalid
 */
const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
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
