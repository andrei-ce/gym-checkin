import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, afterAll, beforeAll } from 'vitest';
import { createAndAuthUser } from 'utils/tests/create-and-auth-user';

describe('Create check-ins test E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should create a check-in', async () => {
    const { token } = await createAndAuthUser(app, true);

    const createdGymResponse = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Gym',
        description: 'WHere you are bound to fail',
        phone: '+5511999999999',
        latitude: -23.562006,
        longitude: -46.688443,
      });

    const gymId = createdGymResponse.body.gym.id;

    const res = await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -23.562007,
        userLongitude: -46.688444,
      });

    expect(res.statusCode).toEqual(201);
  });
});
