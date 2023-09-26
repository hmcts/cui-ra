import { Route } from './../../constants';

import csurf from 'csurf';
import type { Application } from 'express';

export class CSRFToken {
  public enableFor(app: Application): void {
    app.use([Route.JOURNEY_DISPLAY_FLAGS, Route.REVIEW], csurf(), (req, res, next) => {
      res.locals.csrfToken = req.csrfToken();
      next();
    });
  }
}
