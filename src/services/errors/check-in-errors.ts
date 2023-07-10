import { env } from '@/env';

export class MaxDistanceError extends Error {
  constructor(message = 'User is too far from the gym.') {
    super(message);
  }
}

export class SameDayError extends Error {
  constructor(message = 'User has already checked into a gym today.') {
    super(message);
  }
}

export class LateCheckInValidationError extends Error {
  constructor(
    message = `Checkin validation should happen whithin ${env.VALIDATION_TIME_LIMIT_MIN}minutes.`
  ) {
    super(message);
  }
}
