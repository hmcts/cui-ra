import { ErrorMessages, HeaderParams } from '../constants';

import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';

@autobind
export class RequireIdam {
  public async check(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idamToken: string | string[] | undefined = req.headers[HeaderParams.IDAM_TOKEN];
      if (idamToken) {
        next();
      } else {
        return res.status(401).json({ error: ErrorMessages.IDAM_TOKEN_MISSING });
      }
    } catch {
      return res.status(401).json({ error: ErrorMessages.IDAM_TOKEN_MISSING });
    }
  }
}
