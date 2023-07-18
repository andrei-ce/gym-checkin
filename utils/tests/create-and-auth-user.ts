import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthUser(app: FastifyInstance) {
  const email = 'fulanoide@test.com';
  const password = '123456';
  const name = 'Fulaninho';

  await request(app.server).post('/users').send({ name, email, password });

  const authResponse = await request(app.server).post('/sessions').send({
    email,
    password,
  });

  const { token } = authResponse.body;

  return { token };
}
