import { FastifyInstance } from 'fastify';
import { GymController } from './gymController';
import { verifyJwt } from '../../middlewares/verifyJwt';
import { verifyUserRole } from '@/http/middlewares/verifyUserRole';

const gymController = new GymController();

export const gymRoutes = async (app: FastifyInstance) => {
  // ** All routes are authenticated **
  app.addHook('onRequest', verifyJwt);

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, (request, reply) =>
    gymController.create(request, reply)
  );
  app.get('/gyms/search', (request, reply) => gymController.search(request, reply));
  app.get('/gyms/nearby', (request, reply) => gymController.nearby(request, reply));
};
