import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, afterAll, beforeAll } from 'vitest';

describe('Refresh token tests E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should refresh a token & refreshToken if main token is invalid or missing', async () => {
    const email = 'fulanoide@test.com';
    const password = '123456';

    await request(app.server).post('/users').send({
      name: 'Fulaninho',
      email,
      password,
    });

    const authResponse = await request(app.server).post('/sessions').send({
      email,
      password,
    });

    const cookies = authResponse.get('Set-Cookie');

    const res = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ token: expect.any(String) });
    expect(res.get('Set-Cookie')).toEqual([expect.stringContaining('refreshToken=')]);
  });
});
