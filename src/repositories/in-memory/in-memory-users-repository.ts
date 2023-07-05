import type { User, Prisma } from '@prisma/client';
import { UsersRepository } from '../users-repository';

export class InMemoryUsersReposiroty implements UsersRepository {
  public items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((i) => i.email === email);
    if (!user) {
      return null;
    } else {
      return user;
    }
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };
    this.items.push(user);
    return user;
  }
}
