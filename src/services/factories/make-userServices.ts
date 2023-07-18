import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthService } from '../user/authService';
import { RegisterService } from '../user/registerService';
import { GetUserProfileService } from '../user/getProfileService';

export class UserServicesFactory {
  private usersRepositoryType = new PrismaUsersRepository();

  makeRegisterService(): RegisterService {
    // SOLI(D) because the service does not depend on picking a the repository,
    // we inject the repository into the service when instantiating it
    return new RegisterService(this.usersRepositoryType);
  }

  makeAuthService(): AuthService {
    return new AuthService(this.usersRepositoryType);
  }

  makeGetUserProfileService(): GetUserProfileService {
    return new GetUserProfileService(this.usersRepositoryType);
  }
}
