const request = require('supertest');
const app = require('../server');

describe('Backend API', () => {
  it('should return project status at root', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      project: 'Pulse Board',
      status: 'Backend Running'
    });
  });

  it('should return overview data with metrics and health', async () => {
    const response = await request(app).get('/api/overview');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('metrics');
    expect(response.body.metrics).toHaveProperty('totalApplications');
    expect(response.body).toHaveProperty('health');
    expect(response.body.health).toHaveProperty('cpuStatus');
    expect(response.body).toHaveProperty('alerts');
    expect(Array.isArray(response.body.alerts)).toBe(true);
  });

  it('should return alerts array from /api/alerts', async () => {
    const response = await request(app).get('/api/alerts');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
