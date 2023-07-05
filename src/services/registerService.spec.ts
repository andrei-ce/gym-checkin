import { describe, it, expect, beforeEach } from 'vitest';
import { RegisterService } from './registerService';
import { compare } from 'bcryptjs';
import { InMemoryUsersReposiroty } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-errors';

let usersRepository: InMemoryUsersReposiroty;
let sut: RegisterService;

describe('Register Service tests!', () => {
  beforeEach(() => {
    // we don't use prisma instances because this is a unit test!
    usersRepository = new InMemoryUsersReposiroty();
    sut = new RegisterService(usersRepository);
  });

  it('should register a user', async () => {
    const { user } = await sut.handle({
      name: 'Fulano Teste',
      email: 'fulano@test.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.handle({
      name: 'Fulano Teste',
      email: 'fulano@test.com',
      password: '123456',
    });
    const isPasswordHashedCorrectly = await compare('123456', user.password_hash);

    expect(isPasswordHashedCorrectly).toBe(true);
  });

  it('should not register more than one user with the same password', async () => {
    const email = 'fulano@test.com';

    await sut.handle({
      name: 'Fulano Teste',
      email,
      password: '123456',
    });

    await expect(() =>
      sut.handle({
        name: 'Fulano Teste',
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
