import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { GetCheckInHistoryService } from './getCheckInHistory';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetCheckInHistoryService;

describe('Get Check-ins History Service tests!', () => {
  beforeEach(async () => {
    // we don't use prisma instances because this is a unit test!
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetCheckInHistoryService(checkInsRepository);
  });

  it('should get all check-ins from a userId', async () => {
    await checkInsRepository.create({ user_id: 'user-01', gym_id: 'gym-01' });
    await checkInsRepository.create({ user_id: 'user-01', gym_id: 'gym-02' });

    const { checkIns } = await sut.handle({
      userId: 'user-01',
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ]);
  });

  it('should get all check-ins PAGINATED from a userId', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({ user_id: 'user-01', gym_id: `gym-${i}` });
    }

    const { checkIns } = await sut.handle({
      userId: 'user-01',
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ]);
  });
});
