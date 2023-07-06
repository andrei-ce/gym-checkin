import type { Prisma, Checkin } from '@prisma/client';
import { CheckinsRepository } from '../checkins-repository';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

export class InMemoryCheckinsRepository implements CheckinsRepository {
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

  async findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null> {
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

  // async findById(checkinId: string): Promise<Checkin | null> {
  //   const user = this.items.find((i) => i.id === id);
  //   if (!user) {
  //     return null;
  //   } else {
  //     return user;
  //   }
  // }
}
