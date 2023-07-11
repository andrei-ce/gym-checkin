import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { SearchGymsService } from '../gym/searchGymsService';
import { GetNearbyGymsService } from '../gym/getNearbyGyms';

export class CheckInServicesFactory {
  private gymsRepositoryType = new PrismaGymsRepository();

  makeSearchGymsService(): SearchGymsService {
    return new SearchGymsService(this.gymsRepositoryType);
  }

  makeGetNearbyGymsService(): GetNearbyGymsService {
    return new GetNearbyGymsService(this.gymsRepositoryType);
  }
}
