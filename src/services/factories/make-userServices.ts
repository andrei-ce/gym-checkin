import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterService } from '../registerService';
import { AuthService } from '../authService';

export class UserServicesFactory {
  makeRegisterService(): RegisterService {
    // SOLI(D) because the service does not depend on picking a the repository,
    // we inject the repository into the service when instantiating it
    const repositoryType = new PrismaUsersRepository();
    const registerService = new RegisterService(repositoryType);

    return registerService;
  }

  makeAuthService(): AuthService {
    // SOLI(D)
    const repositoryType = new PrismaUsersRepository();
    const authService = new AuthService(repositoryType);

    return authService;
  }
}
