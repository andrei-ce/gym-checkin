import { describe, it, expect, beforeEach } from 'vitest';
import { CreateGymService } from './createGymService';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe('Register Service tests!', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymsRepository);
  });

  it('should create a gym', async () => {
    const { gym } = await sut.handle({
      name: 'Test Gym',
      description: null,
      phone: null,
      latitude: -23.562006,
      longitude: -46.688443,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
