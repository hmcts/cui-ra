import { HTTPError } from './../HttpError';

export class DataNotFoundError extends HTTPError {
  constructor(message: string = 'Data not found') {
    super(message, 404);
    this.name = this.constructor.name;
  }
}

export class MasterNotFoundError extends HTTPError {
  constructor(message: string = 'Master flag not found') {
    super(message, 500);
    this.name = this.constructor.name;
  }
}
