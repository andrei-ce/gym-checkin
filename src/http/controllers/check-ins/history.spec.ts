import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, afterAll, beforeAll } from 'vitest';
import { createAndAuthUser } from 'utils/tests/create-and-auth-user';
import { prisma } from '@/lib/prisma';

describe('Get check-in history test E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should get all check-ins by user', async () => {
    const { token } = await createAndAuthUser(app);

    // Sometimes we have a test that depend on the creation of certain resources which don't have a specific route for creation. We could then create it directly on the DB, which is less compliant with a E2E test and more succeptible to errors. We do this here as an example and shortcut (!!!)

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        name: 'JavaScript Gym',
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    await prisma.checkin.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    });

    const res = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
    ]);
  });
});
