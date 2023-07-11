import { env } from '@/env';
import { CheckInsRepository } from '../checkins-repository';
import { prisma } from '@/lib/prisma';
import { Checkin, Prisma } from '@prisma/client';
import { getPaginationIndexes } from 'utils/pagination-config';
import dayjs from 'dayjs';

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = await prisma.checkin.create({ data });

    return checkIn;
  }

  async findById(id: string) {
    const checkIn = await prisma.checkin.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkIn = await prisma.checkin.findFirst({
      where: {
        user_id: userId,
        created_at: { gt: startOfTheDay.toDate(), lt: endOfTheDay.toDate() },
      },
    });
    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const [startIndex] = getPaginationIndexes(page);
    const paginationSize = env.PAGINATION_SIZE;

    const checkIns = await prisma.checkin.findMany({
      where: { user_id: userId },
      take: paginationSize,
      skip: startIndex,
    });

    return checkIns;
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkin.count({ where: { user_id: userId } });
    return count;
  }

  async save(data: Checkin) {
    const checkIn = await prisma.checkin.update({ where: { id: data.id }, data });
    return checkIn;
  }
}
