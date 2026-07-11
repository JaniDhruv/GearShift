/**
 * Reusable Application Test Helper
 *
 * Imports the Express application instance directly from src/app.js,
 * bypassing src/server.js entirely. This ensures that:
 *   - No HTTP server is started (no ports opened)
 *   - No real database connection is established
 *   - No dotenv configuration is loaded from production .env
 *
 * Supertest binds directly to the Express app, making requests
 * in-process without network overhead.
 *
 * @example
 *   const { getTestAgent } = require('../helpers/app');
 *   const { setupTestDB } = require('../helpers/database');
 *
 *   describe('My Feature', () => {
 *     setupTestDB();
 *
 *     it('should do something', async () => {
 *       const res = await getTestAgent().get('/some-route');
 *       expect(res.status).toBe(200);
 *     });
 *   });
 */
const request = require('supertest');
const app = require('../../src/app');

/**
 * Creates and returns a fresh Supertest agent bound to the Express app.
 * Each call creates a new agent — no shared state between tests.
 *
 * @returns {import('supertest').SuperTest<import('supertest').Test>}
 */
const getTestAgent = () => request(app);

module.exports = {
  app,
  getTestAgent
};
