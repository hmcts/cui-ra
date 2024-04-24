export class S2SError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'S2SError';
  }
}

export class UnauthorisedError extends S2SError {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class TokenFormatError extends S2SError {
  constructor(message: string) {
    super(message);
    this.name = 'TokenFormatError';
  }
}

export class TokenInvalidError extends S2SError {
  constructor(message: string) {
    super(message);
    this.name = 'TokenInvalidError';
  }
}
