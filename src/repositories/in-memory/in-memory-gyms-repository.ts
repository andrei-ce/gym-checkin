import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { randomUUID } from 'node:crypto';
import { getPaginationIndexes } from 'utils/pagination-config';
import { getDistanceBtwCoordinates } from 'utils/get-distance-btw-coordinates';
import { env } from '@/env';

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const gym = this.items.find((gym) => gym.id === id);
    if (!gym) {
      return null;
    } else {
      return gym;
    }
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    };
    this.items.push(gym);
    return gym;
  }

  async searchMany(query: string, page: number) {
    const [startIndex, endIndex] = getPaginationIndexes(page);

    const gyms = this.items
      .filter((gym) => gym.name.toLowerCase().includes(query.toLowerCase()))
      .slice(startIndex, endIndex);
    return gyms;
  }

  async findManyNearby(data: FindManyNearbyParams) {
    const gyms = this.items.filter((item) => {
      const distance = getDistanceBtwCoordinates(
        {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        }
      );
      return distance < env.MAX_DISTANCE_TO_SEARCH_NEARBY_KM;
    });

    return gyms;
  }
}
