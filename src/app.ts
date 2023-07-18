import { env } from './env';
import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { userRoutes } from './http/controllers/users/routes';
import { gymRoutes } from './http/controllers/gyms/routes';
import { checkInRoutes } from './http/controllers/check-ins/routes';
import { globalErrorHandler } from './services/errors/global-error-handler';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'refreshToken', signed: false },
  sign: {
    expiresIn: 600, //10 min
  },
});
app.register(fastifyCookie);
app.register(userRoutes);
app.register(gymRoutes);
app.register(checkInRoutes);
app.setErrorHandler(globalErrorHandler);
