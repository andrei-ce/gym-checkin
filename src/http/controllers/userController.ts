import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterService } from '@/services/registerService';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import {
  UserAlreadyExistsError,
  UserInvalidCredentialsError,
} from '@/services/errors/user-errors';
import { AuthService } from '@/services/authService';

export class UserController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
      // SOLI(D)
      const repositoryType = new PrismaUsersRepository();
      const registerService = new RegisterService(repositoryType);
      await registerService.handle({ name, email, password });
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return reply.status(409).send({ message: error.message });
      }
      throw error;
    }
    return reply.code(201).send();
  }

  async authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
      // SOLI(D)
      const repositoryType = new PrismaUsersRepository();
      const authService = new AuthService(repositoryType);
      await authService.handle({ email, password });
    } catch (error) {
      if (error instanceof UserInvalidCredentialsError) {
        return reply.status(400).send({ message: error.message });
      }
      throw error;
    }

    return reply.code(200).send('banana');
  }
}
