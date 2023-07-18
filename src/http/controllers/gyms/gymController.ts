import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { GymServicesFactory } from '@/services/factories/make-gymServices';

export class GymController {
  private gymServices = new GymServicesFactory();
  private createGymService = this.gymServices.makeCreateGymService();
  private searchGymService = this.gymServices.makeSearchGymsService();
  private nearbyGymService = this.gymServices.makeGetNearbyGymsService();

  constructor() {
    //we either do bind, OR call this as an arrow function in the routes.ts
    // this.createGymService = this.register.bind(this);
    // this.authenticate = this.authenticate.bind(this);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchema = z.object({
      name: z.string(),
      description: z.string().nullable(),
      phone: z.string().nullable(),
      latitude: z.number().refine((val) => {
        return Math.abs(val) <= 90;
      }),
      longitude: z.number().refine((val) => {
        return Math.abs(val) <= 180;
      }),
    });
    const { name, description, phone, latitude, longitude } =
      createGymBodySchema.parse(request.body);

    await this.createGymService.handle({
      name,
      description,
      phone,
      latitude,
      longitude,
    });

    return reply.code(201).send();
  }

  async search(request: FastifyRequest, reply: FastifyReply) {
    const searchGymsQuerySchema = z.object({
      query: z.string(),
      page: z.coerce.number().min(1).default(1),
    });

    const { query, page } = searchGymsQuerySchema.parse(request.query);

    const gyms = await this.searchGymService.handle({
      query,
      page,
    });

    return reply.code(200).send(gyms);
  }

  async nearby(request: FastifyRequest, reply: FastifyReply) {
    const nearbyGymsQuerySchema = z.object({
      latitude: z.coerce.number().refine((val) => {
        return Math.abs(val) <= 90;
      }),
      longitude: z.coerce.number().refine((val) => {
        return Math.abs(val) <= 180;
      }),
    });

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query);

    const gyms = await this.nearbyGymService.handle({
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return reply.code(200).send(gyms);
  }
}
