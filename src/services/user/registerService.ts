import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from '../errors/user-errors';
import type { User } from '@prisma/client';

interface RegisterServiceRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterServiceResponse {
  user: User;
}
// SOLID (Dependency Inversion)
// instead of a function that instantiates dependenvies (eg. PrismaUsersRepository),
// we define a class that receives dependencies as parameters

// in other words, this service doesn't know which DB we're using -- we're
// injecting it on the constructor() -- only the types (Interface)

export class RegisterService {
  private usersRepository: UsersRepository;
  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async handle({
    name,
    email,
    password,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);
    if (userAlreadyExists) {
      throw new UserAlreadyExistsError(
        'Cannot register a user with an existing email'
      );
    }
    //len 6 is something recommended on a service that is not core
    const password_hash = await hash(password, 6);
    const user = await this.usersRepository.create({ name, email, password_hash });

    return { user };
  }
}
