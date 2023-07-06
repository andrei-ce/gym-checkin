export class UserAlreadyExistsError extends Error {
  constructor(message = 'User already exists.') {
    super(message);
  }
}

export class UserInvalidCredentialsError extends Error {
  constructor(message = 'Invalid credentials.') {
    super(message);
  }
}
