import { FastifyInstance } from 'fastify';
import { CheckInController } from './checkInController';
import { authMiddleware } from '../../middlewares/authenticate';

const checkInController = new CheckInController();

export const checkInRoutes = async (app: FastifyInstance) => {
  // ** All routes are authenticated **
  app.addHook('onRequest', authMiddleware);

  app.post('/gyms/:gymId/check-ins', (request, reply) =>
    checkInController.create(request, reply)
  );

  app.patch('/check-ins/:checkInId/validate', (request, reply) =>
    checkInController.validate(request, reply)
  );
  app.get('/check-ins/history', (request, reply) =>
    checkInController.history(request, reply)
  );
  app.get('/check-ins/metrics', (request, reply) =>
    checkInController.metrics(request, reply)
  );
};
