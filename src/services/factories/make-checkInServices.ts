import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { CheckInService } from '../check-in/checkinService';
import { ValidateCheckInService } from '../check-in/validateCheckInService';
import { GetCheckInHistoryService } from '../check-in/getCheckInHistory';
import { GetUserMetricsService } from '../check-in/getUserMetrics';

export class CheckInServicesFactory {
  private checkInsRepositoryType = new PrismaCheckInsRepository();
  private gymsRepositoryType = new PrismaGymsRepository();

  makeCheckInService(): CheckInService {
    return new CheckInService(this.checkInsRepositoryType, this.gymsRepositoryType);
  }

  makeValidateCheckInService(): ValidateCheckInService {
    return new ValidateCheckInService(this.checkInsRepositoryType);
  }

  makeGetCheckInHistoryService(): GetCheckInHistoryService {
    return new GetCheckInHistoryService(this.checkInsRepositoryType);
  }

  makeGetUserMetricsService(): GetUserMetricsService {
    return new GetUserMetricsService(this.checkInsRepositoryType);
  }
}
