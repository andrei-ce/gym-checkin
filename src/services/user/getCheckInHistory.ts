import type { Checkin } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/checkins-repository';

interface GetCheckInHistoryServiceRequest {
  userId: string;
  page: number;
}

interface GetCheckInHistoryServiceResponse {
  checkIns: Checkin[];
}

export class GetCheckInHistoryService {
  private checkInsRepository: CheckInsRepository;

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }

  async handle({
    userId,
    page,
  }: GetCheckInHistoryServiceRequest): Promise<GetCheckInHistoryServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);

    //encrypt user Id on a JWT ?
    //return JWT
    return { checkIns };
  }
}
