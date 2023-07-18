import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, afterAll, beforeAll } from 'vitest';
import { createAndAuthUser } from 'utils/tests/create-and-auth-user';

describe('Search gyms test E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should search for a gym by name', async () => {
    const { token } = await createAndAuthUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Gym',
        description: 'WHere you are bound to fail',
        phone: '+5511999999999',
        latitude: -23.562006,
        longitude: -46.688443,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Serious Gym',
        description: 'WHere you are bound to laugh',
        phone: '+5511999999991',
        latitude: -23.562005,
        longitude: -46.688444,
      });

    const res = await request(app.server)
      .get('/gyms/search')
      .query({ query: 'Serious' })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.gyms).toHaveLength(1);
    expect(res.body.gyms).toEqual([expect.objectContaining({ name: 'Serious Gym' })]);
  });
});
