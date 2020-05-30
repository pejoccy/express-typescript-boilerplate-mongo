import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Middleware({ type: 'after' })
export class Error404HandlerMiddleware implements ExpressMiddlewareInterface {
  constructor(@Logger(__filename) private log: LoggerInterface) {}

  public use(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (!res.headersSent) {
      const path = `${req.method} ${req.path}`;
      this.log.debug(`Not Found: Request path ${path}`);
      res.status(404).json({
        name: 'NotFoundError',
        message: 'Request resource not found',
        errors: [
          { id: path, type: 'TYPES.ROUTE' },
        ],
      });
    }
    res.end();
  }
}
