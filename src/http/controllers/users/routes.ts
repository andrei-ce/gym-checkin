import { FastifyInstance } from 'fastify';
import { UserController } from './userController';
import { verifyJwt } from '../../middlewares/verifyJwt';

const userController = new UserController();

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', userController.register);
  app.post('/sessions', (request, reply) =>
    userController.authenticate(request, reply)
  );

  app.patch('/token/refresh', (request, reply) =>
    userController.refresh(request, reply)
  );

  // ** Authenticated routes **
  app.get('/me', { onRequest: [verifyJwt] }, (request, reply) =>
    userController.profile(request, reply)
  );
};
