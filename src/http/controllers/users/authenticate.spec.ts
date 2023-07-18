import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, afterAll, beforeAll } from 'vitest';

describe('Authentication tests E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should authenticate a user given the correct credentials', async () => {
    const email = 'fulanoide@test.com';
    const password = '123456';

    await request(app.server).post('/users').send({
      name: 'Fulaninho',
      email,
      password,
    });

    const res = await request(app.server).post('/sessions').send({
      email,
      password,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ token: expect.any(String) });
  });
});
