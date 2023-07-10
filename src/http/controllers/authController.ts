import { UserInvalidCredentialsError } from '@/services/errors/user-errors';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeAuthService } from '@/services/factories/make-authService';

export async function authController(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authService = makeAuthService();

    await authService.handle({ email, password });
  } catch (error) {
    if (error instanceof UserInvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }

  return reply.code(200).send('banana');
}
