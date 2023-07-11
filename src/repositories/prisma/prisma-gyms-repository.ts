import { prisma } from '@/lib/prisma';
import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { env } from '@/env';
import { getPaginationIndexes } from 'utils/pagination-config';

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    return gym;
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }

  async searchMany(query: string, page: number) {
    const [startIndex] = getPaginationIndexes(page);
    const paginationSize = env.PAGINATION_SIZE;

    const gyms = await prisma.gym.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: paginationSize,
      skip: startIndex,
    });

    return gyms;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }
}
