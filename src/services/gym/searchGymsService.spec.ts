import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsService } from '../gym/searchGymsService';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe('Search Gyms Service tests!', () => {
  beforeEach(async () => {
    // we don't use prisma instances because this is a unit test!
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsService(gymsRepository);
  });

  it('should search for gyms by name without case sensitivity', async () => {
    await gymsRepository.create({
      name: 'Javascript',
      description: null,
      phone: null,
      latitude: -23.562006,
      longitude: -46.688443,
    });
    await gymsRepository.create({
      name: 'Java',
      description: null,
      phone: null,
      latitude: -23.56201,
      longitude: -46.68844,
    });

    const { gyms } = await sut.handle({
      query: 'java',
      page: 1,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Javascript' }),
      expect.objectContaining({ name: 'Java' }),
    ]);
  });

  it('should search gyms by name with pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: `Bananas' gym-${i}`,
        description: null,
        phone: null,
        latitude: -23.562006,
        longitude: -46.688443,
      });
    }

    const { gyms } = await sut.handle({
      query: 'banana',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: `Bananas' gym-21` }),
      expect.objectContaining({ name: `Bananas' gym-22` }),
    ]);
  });
});
