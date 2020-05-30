import { HttpError } from 'routing-controllers';
import { ErrorInterface } from './ErrorInterface';

export class PetNotFoundError extends HttpError implements ErrorInterface {
  public isReportable = true;

  constructor() {
    super(404, 'Pet not found!');
  }
}
