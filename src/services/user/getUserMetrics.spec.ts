import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { GetUserMetricsService } from './getUserMetrics';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsService;

describe('Get UserMetrics Service tests!', () => {
  beforeEach(async () => {
    // we don't use prisma instances because this is a unit test!
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsService(checkInsRepository);
  });

  it('should get check-in count metric from a userId', async () => {
    await checkInsRepository.create({ user_id: 'user-01', gym_id: 'gym-01' });
    await checkInsRepository.create({ user_id: 'user-01', gym_id: 'gym-02' });

    const { checkInsCount } = await sut.handle({
      userId: 'user-01',
    });

    expect(checkInsCount).toEqual(2);
  });
});
