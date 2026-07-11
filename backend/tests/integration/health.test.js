const { getTestAgent } = require('../helpers/app');
const { setupTestDB } = require('../helpers/database');

describe('Health Endpoint Integration Test', () => {
  setupTestDB();

  describe('GET /health', () => {
    it('should return 200 OK along with system health status', async () => {
      const response = await getTestAgent().get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(['ok', 'up', 'UP', 'OK']).toContain(response.body.status);
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should include database connection status in health payload', async () => {
      const response = await getTestAgent().get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('database');
      expect(response.body.database).toHaveProperty('status', 'connected');
    });
  });
});
