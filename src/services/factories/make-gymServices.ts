import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { SearchGymsService } from '../gym/searchGymsService';
import { GetNearbyGymsService } from '../gym/getNearbyGyms';
import { CreateGymService } from '../gym/createGymService';

export class GymServicesFactory {
  private gymsRepositoryType = new PrismaGymsRepository();

  makeCreateGymService(): CreateGymService {
    return new CreateGymService(this.gymsRepositoryType);
  }

  makeSearchGymsService(): SearchGymsService {
    return new SearchGymsService(this.gymsRepositoryType);
  }

  makeGetNearbyGymsService(): GetNearbyGymsService {
    return new GetNearbyGymsService(this.gymsRepositoryType);
  }
}
