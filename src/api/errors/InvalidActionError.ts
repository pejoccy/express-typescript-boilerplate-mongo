import { HttpError } from 'routing-controllers';
import { ErrorInterface } from './ErrorInterface';

export class InvalidActionError extends HttpError implements ErrorInterface {

  public name = 'InvalidActionError';
  public isReportable = true;

  constructor(message: string) {
    super(404, message);
  }
}
