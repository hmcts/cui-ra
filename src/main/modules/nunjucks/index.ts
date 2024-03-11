import * as path from 'path';

import { Common, Route } from './../../constants';
import { UrlRoute } from './../../utilities';

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
      noCache: true,
      express: app,
    });

    app.use((req, res, next) => {
      res.locals.route = Route;
      res.locals.common = Common;
      res.locals.pagePath = req.path;
      res.locals.fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      res.locals.welsh = req.session?.welsh ?? false;
      res.locals.hasSession = req.session?.sessioninit ?? false;
      res.locals._t = (key: string) => {
        const lang = req.session?.welsh ? 'cy' : 'en';
        const serviceId = req.session && req.session.hmctsserviceid ? req.session.hmctsserviceid.toUpperCase() : null;
        let result;
        if (serviceId) {
          const envInstance = app.locals.ENV_INSTANCE;
          let serviceKey = `${serviceId}.${key}-${envInstance}`;
          result = res.__({ phrase: `${serviceKey}`, locale: lang });
          if (result !== serviceKey) {
            return result;
          }
          serviceKey = `${serviceId}.${key}`;
          result = res.__({ phrase: `${serviceKey}`, locale: lang });
          if (result !== serviceKey) {
            return result;
          }
        }
        result = res.__({ phrase: `${key}`, locale: lang });
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

      res.locals._route = (route: string, params: { [key: string]: string } = {}) => {
        return UrlRoute.make(route, params, UrlRoute.url(req));
      };

      next();
    });
  }
}
