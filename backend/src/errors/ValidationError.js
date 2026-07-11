const AppError = require('./AppError');

class ValidationError extends AppError {
  constructor(message = 'Validation Error', errors = null) {
    super(message, 400);
    if (errors) {
      this.errors = errors;
    }
  }
}

module.exports = ValidationError;
