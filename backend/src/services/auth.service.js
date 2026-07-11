const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  return {
    id: createdUser._id.toString(),
    name: createdUser.name,
    email: createdUser.email,
    role: createdUser.role
  };
};

module.exports = {
  registerUser
};
