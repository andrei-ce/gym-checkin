import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, afterAll, beforeAll } from 'vitest';

describe('Registration tests E2E', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should register a user given the correct data', async () => {
    const res = await request(app.server).post('/users').send({
      name: 'Fulaninho',
      email: 'fulanoide@test.com',
      password: '123456',
    });
    expect(res.statusCode).toEqual(201);
  });
});
