export class HTTPError extends Error {
  status: number;
  errors?: Array<{ message: string }>;

  constructor(message: string, status: number, errors?: Array<{ message: string }>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
