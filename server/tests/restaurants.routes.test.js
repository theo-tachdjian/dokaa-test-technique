const request = require('supertest');
process.env.DISABLE_SCRAPING = 'true';
const app = require('../app');

describe('Restaurants routes', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/restaurants/cities returns list of cities', async () => {
    const res = await request(app).get('/api/restaurants/cities');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/restaurants/search without query returns restaurants', async () => {
    const res = await request(app).get('/api/restaurants/search');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/restaurants/search with city filter narrows results', async () => {
    const all = await request(app).get('/api/restaurants/search');
    const paris = await request(app).get('/api/restaurants/search').query({ city: 'Paris' });
    expect(paris.status).toBe(200);
    expect(Array.isArray(paris.body)).toBe(true);
    // Paris results should be a subset (can't assert exact count without knowing mock)
    expect(paris.body.length).toBeGreaterThan(0);
    expect(all.body.length).toBeGreaterThanOrEqual(paris.body.length);
  });

  it('GET /api/restaurants/:id/reviews returns an array (mock or real)', async () => {
    const list = await request(app).get('/api/restaurants/search').query({ city: 'Paris' });
    const first = list.body[0];
    const res = await request(app).get(`/api/restaurants/${first.id}/reviews`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});


