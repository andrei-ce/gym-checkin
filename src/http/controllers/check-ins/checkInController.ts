import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { CheckInServicesFactory } from '@/services/factories/make-checkInServices';

export class CheckInController {
  private checkInServices = new CheckInServicesFactory();
  private createCheckInService = this.checkInServices.makeCheckInService();
  private getCheckInHistoryService =
    this.checkInServices.makeGetCheckInHistoryService();
  private getGetUserMetricsService = this.checkInServices.makeGetUserMetricsService();
  private validateCheckInService = this.checkInServices.makeValidateCheckInService();

  constructor() {
    //we either do bind, OR call this as an arrow function in the routes.ts
    // this.register = this.register.bind(this);
    // this.authenticate = this.authenticate.bind(this);
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
      gymId: z.string().uuid(),
    });

    const createCheckInBodySchema = z.object({
      userLatitude: z.number().refine((val) => {
        return Math.abs(val) <= 90;
      }),
      userLongitude: z.number().refine((val) => {
        return Math.abs(val) <= 180;
      }),
    });

    const { userLatitude, userLongitude } = createCheckInBodySchema.parse(
      request.body
    );
    const { gymId } = createCheckInParamsSchema.parse(request.params);

    const checkIn = await this.createCheckInService.handle({
      userId: request.user.sub,
      gymId,
      userLatitude,
      userLongitude,
    });

    return reply.code(201).send({ checkIn });
  }

  async history(request: FastifyRequest, reply: FastifyReply) {
    const checkInHistoryQuerySchema = z.object({
      page: z.coerce.number().min(1).default(1),
    });

    const { page } = checkInHistoryQuerySchema.parse(request.query);

    const { checkIns } = await this.getCheckInHistoryService.handle({
      page,
      userId: request.user.sub,
    });

    return reply.code(200).send({ checkIns });
  }

  async metrics(request: FastifyRequest, reply: FastifyReply) {
    const { checkInsCount } = await this.getGetUserMetricsService.handle({
      userId: request.user.sub,
    });

    return reply.code(200).send({ checkInsCount });
  }

  async validate(request: FastifyRequest, reply: FastifyReply) {
    const validateCheckInParamsSchema = z.object({
      checkInId: z.string().uuid(),
    });

    const { checkInId } = validateCheckInParamsSchema.parse(request.params);

    await this.validateCheckInService.handle({
      checkInId,
    });

    return reply.code(204).send();
  }
}
