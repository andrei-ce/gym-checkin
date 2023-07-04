import { FastifyInstance } from 'fastify';
import { register } from './controllers/userController';

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', register);
};
