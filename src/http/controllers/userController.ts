import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import {
  UserAlreadyExistsError,
  UserInvalidCredentialsError,
} from '@/services/errors/user-errors';
import { UserServicesFactory } from '@/services/_factories/make-userServices';

export class UserController {
  private userServices = new UserServicesFactory();
  private registerService = this.userServices.makeRegisterService();
  private authService = this.userServices.makeAuthService();

  async register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });
    const { name, email, password } = registerBodySchema.parse(request.body);

    try {
      await this.registerService.handle({ name, email, password });
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
      await this.authService.handle({ email, password });
    } catch (error) {
      if (error instanceof UserInvalidCredentialsError) {
        return reply.status(400).send({ message: error.message });
      }
      throw error;
    }

    return reply.code(200).send('banana');
  }
}
