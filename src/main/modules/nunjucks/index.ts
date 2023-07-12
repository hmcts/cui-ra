import * as path from 'path';

import * as express from 'express';
import * as nunjucks from 'nunjucks';

export class Nunjucks {
  constructor(public developmentMode: boolean) {
    this.developmentMode = developmentMode;
  }

  enableFor(app: express.Express): void {
    app.set('view engine', 'njk');
    nunjucks.configure(path.join(__dirname, '..', '..', 'views'), {
      autoescape: true,
      watch: this.developmentMode,
      express: app,
    });

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;
      res.locals.fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      res.locals._t = (key: string) => {
        const serviceId = 'PFL'; // The service ID will need to be pulled from the cache

        if (!serviceId) {
          return res.__(key);
        }

        const serviceKey = `${serviceId}.${key}`;
        const fallback = res.__(key);
        let result = res.__(`${serviceKey}:${fallback}`);

        if (result !== (serviceKey || key)) {
          return result;
        }

        result = res.__(serviceKey);

        if (result !== serviceKey) {
          return result;
        }

        return res.__(key);
      };

      next();
    });
  }
}
