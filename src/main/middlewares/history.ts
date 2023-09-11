import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';

@autobind
export class History {
  public async add(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      // Initialize navigation history array if it doesn't exist
      req.session.history = req.session.history || [];

      // Add the current path to history if it's not already there
      if (req.session.history.at(-1) !== req.path) {
        req.session.history.push(req.path);
        console.log(req.session.history);
      }
    } finally {
      next();
    }
  }
}
