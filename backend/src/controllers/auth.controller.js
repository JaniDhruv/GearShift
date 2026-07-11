const authService = require('../services/auth.service');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Auth Controller
 * Clean Architecture Layer: Interface Adapters
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation: required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validation: email format
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validation: password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = await authService.registerUser({ name, email, password, role });
    return res.status(201).json({ user });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ error: error.message });
    }
    return next(error);
  }
};

module.exports = {
  register
};
