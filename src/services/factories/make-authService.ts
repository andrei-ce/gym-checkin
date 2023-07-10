import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthService } from '../user/authService';

export function makeAuthService(): AuthService {
  // SOLI(D)
  const repositoryType = new PrismaUsersRepository();
  const authService = new AuthService(repositoryType);

  return authService;
}
