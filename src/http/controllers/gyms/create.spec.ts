import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, afterAll, beforeAll } from 'vitest';
import { createAndAuthUser } from 'utils/tests/create-and-auth-user';

describe('Create gyms test E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should create a gym', async () => {
    const { token } = await createAndAuthUser(app, true);

    const res = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Gym',
        description: 'WHere you are bound to fail',
        phone: '+5511999999999',
        latitude: -23.562006,
        longitude: -46.688443,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.gym).toEqual(
      expect.objectContaining({ name: 'Test Gym', longitude: '-46.688443' })
    );
  });
});
