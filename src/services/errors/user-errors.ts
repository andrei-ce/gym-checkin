export class UserAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UserInvalidCredentialsError extends Error {
  constructor(message = 'Invalid credentials.') {
    super(message);
  }
}
