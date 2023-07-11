import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository';
import { CheckInService } from '../check-in/checkinService';
import { ValidateCheckInService } from '../check-in/validateCheckInService';
import { GetCheckInHistoryService } from '../user/getCheckInHistory';

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
}
