import { UsersRepository } from '@/repositories/users-repository';
import { compare } from 'bcryptjs';
import { UserInvalidCredentialsError } from './errors/user-errors';
import type { User } from '@prisma/client';

interface AuthServiceRequest {
  email: string;
  password: string;
}

interface AuthServiceResponse {
  user: User;
}

export class AuthService {
  private usersRepository: UsersRepository;
  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async handle({ email, password }: AuthServiceRequest): Promise<AuthServiceResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UserInvalidCredentialsError();
    }

    const isPasswordCorrect = await compare(password, user.password_hash);
    if (!isPasswordCorrect) {
      throw new UserInvalidCredentialsError();
    }

    //encrypt user Id on a JWT ?
    //return JWT
    return { user };
  }
}
