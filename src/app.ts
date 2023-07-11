import fastify from 'fastify';
import { appRoutes } from './http/routes';
import { globalErrorHandler } from './services/errors/global-error-handler';
import fastifyJwt from '@fastify/jwt';
import { env } from './env';

export const app = fastify();

app.register(fastifyJwt, { secret: env.JWT_SECRET });
app.register(appRoutes);
app.setErrorHandler(globalErrorHandler);
