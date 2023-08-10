import * as path from 'path';

import { Route } from './../../constants';

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
      res.locals.route = Route;
      res.locals.pagePath = req.path;
      res.locals.fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      res.locals._t = (key: string) => {
        const serviceId = req.session.hmctsserviceid;
        let result;
        if (serviceId) {
          const serviceKey = `${serviceId}.${key}`;
          const fallback = res.__(key);
          result = res.__(`${serviceKey}:${fallback}`);
          if (result !== (serviceKey && key)) {
            return result;
          }
        }
        result = res.__(key);
        if (result !== key) {
          return result;
        }
        return null;
      };

      res.locals._r = (text: string | undefined, values: { [key: string]: string } = {}) => {
        if (!values || !text) {
          return text;
        }
        const reg = /\{([^}]+)\}/g;
        return text.replace(reg, (matched: string, key: string) => values[key] || matched);
      };

      next();
    });
  }
}
