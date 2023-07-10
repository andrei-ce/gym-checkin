import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { ValidateCheckInService } from './validateCheckInService';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { LateCheckInValidationError } from '../errors/check-in-errors';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe('Validate Check-in Service tests!', () => {
  beforeEach(async () => {
    // we don't use prisma instances because this is a unit test!
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInService(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should validate a user check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    const { checkIn } = await sut.handle({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it('should not validate an inexistent check-in', async () => {
    await expect(() =>
      sut.handle({
        checkInId: 'INVALID_CHECKIN_ID',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not validate a check-in that was created more than 20 min ago', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    // set 21 min ahead
    vi.setSystemTime(new Date(2023, 0, 1, 14, 1));

    await expect(() =>
      sut.handle({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
