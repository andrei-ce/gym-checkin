import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from './authService';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserInvalidCredentialsError } from '../errors/user-errors';

let usersRepository: InMemoryUsersRepository;
let sut: AuthService;

describe('Authenticate Service tests!', () => {
  beforeEach(() => {
    // we don't use prisma instances because this is a unit test!
    usersRepository = new InMemoryUsersRepository();
    // system under test
    sut = new AuthService(usersRepository);
  });

  it('should authenticate a user with valid credentials', async () => {
    await usersRepository.create({
      name: 'Fulano Teste',
      email: 'fulano@test.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.handle({
      email: 'fulano@test.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not authenticate a user with wrong email', async () => {
    await expect(() =>
      sut.handle({
        email: 'WRONG_EMAIL@test.com',
        password: 'ANY_PASSWORD',
      })
    ).rejects.toBeInstanceOf(UserInvalidCredentialsError);
  });

  it('should not authenticate a user with wrong password', async () => {
    await usersRepository.create({
      name: 'Fulano Teste',
      email: 'fulano@test.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() =>
      sut.handle({
        email: 'fulano@test.com',
        password: 'WRONG_PASSWORD',
      })
    ).rejects.toBeInstanceOf(UserInvalidCredentialsError);
  });
});
