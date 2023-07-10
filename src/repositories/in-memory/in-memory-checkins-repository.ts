import type { Prisma, Checkin } from '@prisma/client';
import { CheckInsRepository } from '../checkins-repository';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { getPaginationIndexes } from 'utils/pagination-config';

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: Checkin[] = [];

  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const { user_id, gym_id } = data;
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id,
      gym_id,
    };
    this.items.push(checkIn);

    return checkIn;
  }

  async findById(id: string) {
    const checkIn = this.items.find((i) => i.id === id);
    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async save(checkIn: Checkin) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);
    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn;
    }

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkInOnSameDay = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDay) {
      return null;
    } else {
      return checkInOnSameDay;
    }
  }

  async findManyByUserId(userId: string, page: number) {
    const [startIndex, endIndex] = getPaginationIndexes(page);

    const checkIns = this.items
      .filter((i) => i.user_id === userId)
      .slice(startIndex, endIndex);

    return checkIns;
  }

  async countByUserId(id: string) {
    const checkInsCount = this.items.reduce((count, checkIn) => {
      if (checkIn.user_id === id) {
        return count + 1;
      }
      return count;
    }, 0);

    return checkInsCount;
  }
}
