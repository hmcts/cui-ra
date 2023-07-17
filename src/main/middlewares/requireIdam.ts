import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';

@autobind
export class RequireIdam {
  public async check(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const idamToken: string | string[] | undefined = req.headers['idam-token'];
      if (idamToken) {
        next();
      }
    } catch {
      return res.status(401).json({ error: 'idam token is missing' });
    }
  }
}
