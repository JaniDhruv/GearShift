const request = require('supertest');
const app = require('../../src/app');

describe('Health Endpoint Integration Test', () => {
  describe('GET /health', () => {
    it('should return 200 OK along with system health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(['ok', 'up', 'UP', 'OK']).toContain(response.body.status);
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
