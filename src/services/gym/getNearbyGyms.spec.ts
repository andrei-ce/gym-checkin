import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { GetNearbyGymsService } from '../gym/getNearbyGyms';

let gymsRepository: InMemoryGymsRepository;
let sut: GetNearbyGymsService;

describe('Get Nearby Gyms Service tests!', () => {
  beforeEach(async () => {
    // we don't use prisma instances because this is a unit test!
    gymsRepository = new InMemoryGymsRepository();
    sut = new GetNearbyGymsService(gymsRepository);
  });

  it('should get nearby gyms within max distance', async () => {
    await gymsRepository.create({
      name: 'Nearby Gym',
      description: null,
      phone: null,
      latitude: -23.562006,
      longitude: -46.6884428,
    });
    await gymsRepository.create({
      name: 'Faraway Gym',
      description: null,
      phone: null,
      latitude: -28.01,
      longitude: -48.01,
    });

    const { gyms } = await sut.handle({
      userLatitude: -23.5620061,
      userLongitude: -46.6884429,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ name: 'Nearby Gym' })]);
  });
});
