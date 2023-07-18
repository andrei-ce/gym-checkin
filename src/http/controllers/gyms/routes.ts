import { FastifyInstance } from 'fastify';
import { GymController } from './gymController';
import { authMiddleware } from '../../middlewares/authenticate';

const gymController = new GymController();

export const gymRoutes = async (app: FastifyInstance) => {
  // ** All routes are authenticated **
  app.addHook('onRequest', authMiddleware);

  app.post('/gyms', (request, reply) => gymController.create(request, reply));
  app.get('/gyms/search', (request, reply) => gymController.search(request, reply));
  app.get('/gyms/nearby', (request, reply) => gymController.nearby(request, reply));
};
