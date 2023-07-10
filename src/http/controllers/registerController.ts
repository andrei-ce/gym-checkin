import { UserAlreadyExistsError } from '@/services/errors/user-errors';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeRegisterService } from '@/services/factories/make-registerService';

//FILE NOT USED; migrated to one UserController
//FILE NOT USED; migrated to one UserController
//FILE NOT USED; migrated to one UserController
//FILE NOT USED; migrated to one UserController
//FILE NOT USED; migrated to one UserController
//FILE NOT USED; migrated to one UserController

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });
  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerService = makeRegisterService();

    await registerService.handle({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }
    throw error;
  }
  return reply.code(201).send();
}
