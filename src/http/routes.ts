// import { authController } from './controllers/authController';
// import { registerController } from './controllers/registerController';
import { FastifyInstance } from 'fastify';
import { UserController } from './controllers/userController';

const userController = new UserController();

export const appRoutes = async (app: FastifyInstance) => {
  // app.post('/users', registerController);
  // app.post('/sessions', authController);
  app.post('/users', userController.register);
  app.post('/sessions', (request, reply) =>
    userController.authenticate(request, reply)
  );
};
