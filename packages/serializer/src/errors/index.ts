class BaseError extends Error {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

export class UndefinedResourceError extends BaseError {
  constructor(message: string = 'Resource must be defined') {
    super(message);
  }
}
