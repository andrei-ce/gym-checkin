import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterService } from '@/services/registerService';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists';

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
}

// export async function register(request: FastifyRequest, reply: FastifyReply) {
//   const registerBodySchema = z.object({
//     name: z.string(),
//     email: z.string().email(),
//     password: z.string().min(6),
//   });

//   const { name, email, password } = registerBodySchema.parse(request.body);

//   try {
//     // SOLI(D)
//     const repositoryType = new PrismaUsersRepository();
//     const registerService = new RegisterService(repositoryType);
//     await registerService.handle({ name, email, password });
//   } catch (error) {
//     if (error instanceof UserAlreadyExistsError) {
//       return reply.status(409).send({ message: error.message });
//     }
//     throw error;
//   }
//   return reply.code(201).send();
// }
