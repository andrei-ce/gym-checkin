import { FastifyReply, FastifyRequest } from 'fastify';
import { InsufficientRightsError } from '@/services/errors/user-errors';

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;
    if (role !== roleToVerify) {
      const permissionError = new InsufficientRightsError();
      reply.code(401).send({ message: permissionError.message });
    }
  };
}
