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

module.exports = {
  register
};
