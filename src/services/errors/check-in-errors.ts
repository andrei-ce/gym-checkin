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
