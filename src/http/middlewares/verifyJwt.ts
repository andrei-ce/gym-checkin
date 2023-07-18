import { FastifyReply, FastifyRequest } from 'fastify';
import { InvalidJWTError } from '@/services/errors/user-errors';

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    const JWTError = new InvalidJWTError();
    reply.code(401).send({ message: JWTError.message });
  }
}
