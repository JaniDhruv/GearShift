/**
 * Jest Configuration
 *
 * Supports unit and integration tests following strict TDD practices.
 * Configured for Node.js + Express + MongoDB testing with Supertest.
 */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFiles: ['./jest.setup.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'text-summary', 'lcov', 'clover'],
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 10000
};
