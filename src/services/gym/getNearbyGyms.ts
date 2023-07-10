import type { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface GetNearbyGymsServiceRequest {
  userLatitude: number;
  userLongitude: number;
}

interface GetNearbyGymsServiceResponse {
  gyms: Gym[];
}

export class GetNearbyGymsService {
  private gymsRepository: GymsRepository;
  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository;
  }

  async handle({
    userLatitude,
    userLongitude,
  }: GetNearbyGymsServiceRequest): Promise<GetNearbyGymsServiceResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
