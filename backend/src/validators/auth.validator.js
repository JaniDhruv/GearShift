const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates user registration payload.
 *
 * @param {Object} data payload containing { name, email, password }
 * @returns {Object|null} { error: string } if invalid, or null if valid
 */
const validateRegistrationInput = ({ name, email, password }) => {
  if (!name || !email || !password) {
    return { error: 'Name, email, and password are required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { error: 'Invalid email format' };
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long' };
  }
  return null;
};

module.exports = {
  validateRegistrationInput,
  EMAIL_REGEX
};
