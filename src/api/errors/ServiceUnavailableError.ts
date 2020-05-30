import { HttpError } from 'routing-controllers';
import { ErrorInterface } from './ErrorInterface';

export class ServiceUnavailableError extends HttpError implements ErrorInterface {

  public name = 'ServiceUnavailableError';
  public isReportable = true;

  constructor(public cause: Error, message?: string) {
    super(501, message || cause.message);
  }
}
