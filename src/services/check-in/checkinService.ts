import type { Checkin } from '@prisma/client';
import { CheckInsRepository } from '@/repositories/checkins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error';
import { getDistanceBtwCoordinates } from 'utils/get-distance-btw-coordinates';
import { env } from '@/env';
import { MaxDistanceError, SameDayError } from '../errors/check-in-errors';

interface CheckinServiceRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckinServiceResponse {
  checkIn: Checkin;
}

export class CheckInService {
  private checkinsRepository: CheckInsRepository;
  private gymsRepository: GymsRepository;

  constructor(checkinsRepository: CheckInsRepository, gymsRepository: GymsRepository) {
    this.checkinsRepository = checkinsRepository;
    this.gymsRepository = gymsRepository;
  }

  async handle({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckinServiceRequest): Promise<CheckinServiceResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const dist = getDistanceBtwCoordinates(
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
      { latitude: userLatitude, longitude: userLongitude }
    );

    if (dist > env.MAX_DISTANCE_TO_CHECKIN_KM) {
      throw new MaxDistanceError();
    }

    const checkInOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDay) throw new SameDayError();

    const checkIn = await this.checkinsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    //encrypt user Id on a JWT ?
    //return JWT
    return { checkIn };
  }
}
