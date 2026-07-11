const {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
} = require('../../src/errors');

describe('Custom Error Classes Unit Tests', () => {
  describe('AppError', () => {
    it('should create an AppError with custom status code and message', () => {
      const err = new AppError('Custom Error', 418);
      expect(err.message).toBe('Custom Error');
      expect(err.statusCode).toBe(418);
      expect(err.status).toBe(418);
      expect(err.isOperational).toBe(true);
      expect(err instanceof Error).toBe(true);
    });
  });

  describe('ValidationError', () => {
    it('should default to 400 status code', () => {
      const err = new ValidationError('Invalid input', ['email required']);
      expect(err.statusCode).toBe(400);
      expect(err.message).toBe('Invalid input');
      expect(err.errors).toEqual(['email required']);
    });
  });

  describe('UnauthorizedError', () => {
    it('should default to 401 status code', () => {
      const err = new UnauthorizedError();
      expect(err.statusCode).toBe(401);
      expect(err.message).toBe('Unauthorized');
    });
  });

  describe('ForbiddenError', () => {
    it('should default to 403 status code', () => {
      const err = new ForbiddenError();
      expect(err.statusCode).toBe(403);
      expect(err.message).toBe('Forbidden');
    });
  });

  describe('NotFoundError', () => {
    it('should default to 404 status code', () => {
      const err = new NotFoundError('Resource missing');
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('Resource missing');
    });
  });
});
