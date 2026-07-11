/**
 * Reusable Test App Helper
 *
 * Provides a configured Supertest agent bound to the Express app instance.
 * Use this in integration tests to avoid importing app and supertest separately.
 */
const request = require('supertest');
const app = require('../../src/app');

/**
 * Creates and returns a Supertest agent for HTTP integration testing.
 * @returns {import('supertest').SuperTest<import('supertest').Test>}
 */
const getTestAgent = () => request(app);

module.exports = {
  app,
  getTestAgent
};
