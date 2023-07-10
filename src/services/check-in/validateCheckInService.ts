import type { Checkin } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/checkins-repository';
import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from '../errors/check-in-errors';

interface ValidateCheckinServiceRequest {
  checkInId: string;
}

interface ValidateCheckinServiceResponse {
  checkIn: Checkin;
}

export class ValidateCheckInService {
  private checkinsRepository: CheckInsRepository;

  constructor(checkinsRepository: CheckInsRepository) {
    this.checkinsRepository = checkinsRepository;
  }

  async handle({
    checkInId,
  }: ValidateCheckinServiceRequest): Promise<ValidateCheckinServiceResponse> {
    const checkIn = await this.checkinsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    //diff compares a date in the future - date in the past
    const timePassedFromCheckinCreationInMin = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    );

    if (timePassedFromCheckinCreationInMin > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();
    await this.checkinsRepository.save(checkIn);

    return { checkIn };
  }
}
