import { HttpError } from 'routing-controllers';

export class UserNotFoundError extends HttpError {

  public name = 'UserNotFoundError';

  constructor() {
    super(404, 'User not found!');
  }

  public toJSON(): {status: number, failedOperation: string} {
    return {
      status: this.httpCode,
      failedOperation: 'Failed operation',
    };
  }
}
