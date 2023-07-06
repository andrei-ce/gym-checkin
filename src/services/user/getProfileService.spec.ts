import { describe, it, expect, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { GetUserProfileService } from './getProfileService';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe('Get User Profile Service tests!', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(usersRepository);
  });

  it('should get the user profile provided a userId', async () => {
    const email = 'fulano@test.com';

    const createdUser = await usersRepository.create({
      name: 'Fulano Teste',
      email,
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.handle({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.email).toEqual(email);
  });

  it('should not find a user profile provided an invalid userId', async () => {
    await expect(() =>
      sut.handle({
        userId: 'INVALID_USER_ID',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
