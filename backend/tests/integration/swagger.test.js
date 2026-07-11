const { getTestAgent } = require('../helpers/app');

describe('Swagger OpenAPI Documentation Integration Test Suite', () => {
  it('should return 200 OK along with OpenAPI specification JSON at /api-docs.json', async () => {
    const response = await getTestAgent().get('/api-docs.json');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('openapi', '3.0.0');
    expect(response.body.info).toHaveProperty('title', 'GearShift Dealership Inventory API');
    expect(response.body.paths).toHaveProperty('/auth/login');
    expect(response.body.paths).toHaveProperty('/vehicles');
  });
});
