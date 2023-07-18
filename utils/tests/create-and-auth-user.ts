import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import request from 'supertest';

export async function createAndAuthUser(app: FastifyInstance, isAdmin = false) {
  await prisma.user.create({
    data: {
      email: 'fulanoide@test.com',
      password_hash: await hash('123456', 6),
      name: 'Fulaninho',
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'fulanoide@test.com',
    password: '123456',
  });

  const { token } = authResponse.body;

  return { token };
}
