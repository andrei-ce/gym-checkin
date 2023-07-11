import { UsersRepository } from '../users-repository';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Separating prisma-related operations into a Repository pattern is good because
// 1. easier to change DB later on
// 2. we can easily set up the in-memory repository for unit tests
export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data });
    return user;
  }
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
}
