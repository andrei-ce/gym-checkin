import { FastifyInstance } from 'fastify';
import { UserController } from './userController';
import { authMiddleware } from '../../middlewares/authenticate';

const userController = new UserController();

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', userController.register);
  app.post('/sessions', (request, reply) =>
    userController.authenticate(request, reply)
  );

  // ** Authenticated routes **
  app.get('/me', { onRequest: [authMiddleware] }, (request, reply) =>
    userController.profile(request, reply)
  );
};
