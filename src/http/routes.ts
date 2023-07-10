import { FastifyInstance } from 'fastify';
import { authController } from './controllers/authController';
import { registerController } from './controllers/registerController';
// import { UserController } from './controllers/userController';

export const appRoutes = async (app: FastifyInstance) => {
  // const userController = new UserController();

  app.post('/users', registerController);
  // app.post('/users', userController.register);
  app.post('/sessions', authController);
  // app.post('/sessions', userController.authenticate);
};
