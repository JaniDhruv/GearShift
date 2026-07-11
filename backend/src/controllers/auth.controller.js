const authService = require('../services/auth.service');
const { validateRegistrationInput } = require('../validators/auth.validator');

/**
 * Auth Controller
 * Clean Architecture Layer: Interface Adapters
 */
const register = async (req, res, next) => {
  try {
    const validationError = validateRegistrationInput(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const user = await authService.registerUser(req.body);
    return res.status(201).json({ user });
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ error: error.message });
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { token, user } = await authService.loginUser({ email, password });
    return res.status(200).json({ token, user });
  } catch (error) {
    if (error.status === 401) {
      return res.status(401).json({ error: error.message });
    }
    return next(error);
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = {
  register,
  login,
  getCurrentUser
};
