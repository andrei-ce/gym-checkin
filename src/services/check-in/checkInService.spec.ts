import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CheckInService } from './checkinService';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxDistanceError, SameDayError } from '../errors/check-in-errors';

let checkInsRepository: InMemoryCheckinsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe('Check-in Service tests!', () => {
  beforeEach(async () => {
    // we don't use prisma instances because this is a unit test!
    checkInsRepository = new InMemoryCheckinsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      name: 'Test Gym',
      description: 'This gym is for testing purposes',
      phone: '+5511971557777',
      latitude: -23.562006,
      longitude: -46.688443,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should check in a user into a gym', async () => {
    const { checkIn } = await sut.handle({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.5620061,
      userLongitude: -46.6884429,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not let the user check in twice on the same day', async () => {
    // set fake date
    const fakeDate = new Date(2023, 0, 20, 13, 0, 0, 0);
    vi.setSystemTime(fakeDate);

    await sut.handle({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.5620061,
      userLongitude: -46.6884429,
    });

    await expect(() =>
      sut.handle({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -23.5620061,
        userLongitude: -46.6884429,
      })
    ).rejects.toBeInstanceOf(SameDayError);
  });

  it('should let the user check in twice on diferent days', async () => {
    // set fake date
    vi.setSystemTime(new Date(2023, 0, 20, 13, 0, 0, 0));

    await sut.handle({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.5620061,
      userLongitude: -46.6884429,
    });

    // set fake date + 1 day
    vi.setSystemTime(new Date(2023, 0, 21, 13, 0, 0, 0));

    const { checkIn } = await sut.handle({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.5620061,
      userLongitude: -46.6884429,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check into a distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      name: 'Test Gym 02',
      description: 'This gym is for testing purposes',
      phone: '+5511971558888',
      latitude: -23.538657,
      longitude: -46.690782,
    });

    await expect(() =>
      sut.handle({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -23.5620061,
        userLongitude: -46.6884429,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
