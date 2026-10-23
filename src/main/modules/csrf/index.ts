import { Route } from './../../constants';
import { csrfSync } from 'csrf-sync';
import type { Application } from 'express';

const { generateToken, csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: req => req.body?._csrf,
});

export class CSRFToken {
  public enableFor(app: Application): void {
    app.use([Route.JOURNEY_DISPLAY_FLAGS, Route.REVIEW], csrfSynchronisedProtection, (req, res, next) => {
      res.locals.csrfToken = generateToken(req);
      next();
    });
  }
}
