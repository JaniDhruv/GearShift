const User = require('../models/user.model');

/**
 * User Repository
 * Clean Architecture Layer: Interface Adapters / Data Access
 */
const findByEmail = async (email) => {
  return User.findOne({ email: email.toLowerCase() });
};

const create = async (userData) => {
  const user = new User(userData);
  return user.save();
};

module.exports = {
  findByEmail,
  create
};
