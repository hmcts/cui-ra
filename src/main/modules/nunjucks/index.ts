import * as path from 'path';

import { Common, Route } from './../../constants';
import { UrlRoute } from './../../utilities';
import config from 'config';

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
      res.locals.serviceName = req.session?.serviceName ?? null;
      res.locals.isDev = JSON.parse(config.get('isDev'));
      res.locals._t = (key: string, values: { [key: string]: string } = {}) => {
        const lang = req.session?.welsh ? 'cy' : 'en';
        const serviceId = req.session && req.session.hmctsserviceid ? req.session.hmctsserviceid.toUpperCase() : null;
        const replaceValues = (text: string | null) =>
          text?.replace(/%\{([^}]+)\}/g, (matched: string, name: string) => values[name] || matched) || null;
        const translate = (translationKey: string) => {
          const translationKeys = serviceId
            ? [
                `${serviceId}.${translationKey}-${app.locals.ENV_INSTANCE}`,
                `${serviceId}.${translationKey}`,
                translationKey,
              ]
            : [translationKey];

          for (const candidate of translationKeys) {
            const result = res.__({ phrase: candidate, locale: lang });
            if (result !== candidate) {
              return replaceValues(result);
            }
          }

          return null;
        };

        if (key.endsWith(Common.MAX_LENGTH_ERROR_SUFFIX) && key !== Common.MAX_LENGTH_ERROR_KEY) {
          const flagError = translate(key.replace(Common.MAX_LENGTH_ERROR_SUFFIX, '.empty'));
          const maxLengthError = translate(Common.MAX_LENGTH_ERROR_KEY);
          return `${flagError} ${maxLengthError}`;
        }

        return translate(key);
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
