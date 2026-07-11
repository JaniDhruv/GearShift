const {
  successResponse,
  errorResponse
} = require('../../src/utils/apiResponse');

describe('API Response Utility Unit Tests', () => {
  describe('successResponse', () => {
    it('should return standardized success payload with data', () => {
      const result = successResponse('Operation successful', { id: 1, name: 'Test' });
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('message', 'Operation successful');
      expect(result.data).toEqual({ id: 1, name: 'Test' });
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('name', 'Test');
    });

    it('should handle null or undefined data', () => {
      const result = successResponse('OK', null);
      expect(result).toEqual({
        success: true,
        message: 'OK',
        data: null
      });
    });
  });

  describe('errorResponse', () => {
    it('should return standardized error payload', () => {
      const result = errorResponse('Something went wrong');
      expect(result).toEqual({
        success: false,
        message: 'Something went wrong',
        error: 'Something went wrong'
      });
    });

    it('should include additional errors if provided', () => {
      const errors = ['Field A is required'];
      const result = errorResponse('Validation Error', errors);
      expect(result).toEqual({
        success: false,
        message: 'Validation Error',
        error: 'Validation Error',
        errors
      });
    });
  });
});
