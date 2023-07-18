import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, afterAll, beforeAll } from 'vitest';
import { createAndAuthUser } from 'utils/tests/create-and-auth-user';

describe('Nearby gyms test E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should find nearby gyms', async () => {
    const { token } = await createAndAuthUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Nearby Gym',
        description: null,
        phone: null,
        latitude: -23.562006,
        longitude: -46.6884428,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Faraway Gym',
        description: null,
        phone: null,
        latitude: -28.01,
        longitude: -48.01,
      });

    const res = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -23.562006,
        longitude: -46.6884428,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.gyms).toHaveLength(1);
    expect(res.body.gyms).toEqual([expect.objectContaining({ name: 'Nearby Gym' })]);
  });
});
