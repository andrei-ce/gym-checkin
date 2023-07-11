import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import {
  InvalidJWTError,
  UserAlreadyExistsError,
  UserInvalidCredentialsError,
} from '@/services/errors/user-errors';
import { UserServicesFactory } from '@/services/factories/make-userServices';

export class UserController {
  private userServices = new UserServicesFactory();
  private registerService = this.userServices.makeRegisterService();
  private authService = this.userServices.makeAuthService();

  constructor() {
    //we either do bind, OR call this as an arrow function in the routes.ts
    this.register = this.register.bind(this);
    // this.authenticate = this.authenticate.bind(this);
  }

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
      const { user } = await this.authService.handle({ email, password });

      // Encrypt user Id on a JWT here?
      // Yes, because we want Services to be pure. JWT might only be needed in http
      const token = await reply.jwtSign({}, { sign: { sub: user.id } });

      return reply.code(200).send({ token });
    } catch (error) {
      if (error instanceof UserInvalidCredentialsError) {
        return reply.status(400).send({ message: error.message });
      }
      throw error;
    }
  }

  async profile(request: FastifyRequest, reply: FastifyReply) {
    //this comes from the authMiddleware
    const decodedToken = request.user;
    console.log(decodedToken);

    // try {
    //   request.jwtVerify();
    // } catch (error) {
    //   if (error instanceof InvalidJWTError) {
    //     return reply.status(401).send({ message: error.message });
    //   }
    // }

    return reply.code(200).send('profile');
  }
}
