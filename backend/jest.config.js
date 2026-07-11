/**
 * Jest Configuration
 * Supports unit and integration tests following TDD practices.
 */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ],
  verbose: true,
  clearMocks: true
};
