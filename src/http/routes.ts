import { FastifyInstance } from 'fastify';
import { UserController } from './controllers/userController';

const userController = new UserController();

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', userController.register);
  app.post('/sessions', userController.authenticate);
};
