import fastify from 'fastify';
import { userRoutes } from './http/controllers/users/routes';
import { gymRoutes } from './http/controllers/gyms/routes';
import { checkInRoutes } from './http/controllers/check-ins/routes';
import { globalErrorHandler } from './services/errors/global-error-handler';
import fastifyJwt from '@fastify/jwt';
import { env } from './env';

export const app = fastify();

app.register(fastifyJwt, { secret: env.JWT_SECRET });
app.register(userRoutes);
app.register(gymRoutes);
app.register(checkInRoutes);
app.setErrorHandler(globalErrorHandler);
