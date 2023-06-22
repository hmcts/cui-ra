import * as path from 'path';

import { Translations, languages } from './../translations';

import * as express from 'express';
import * as nunjucks from 'nunjucks';

export class Nunjucks {
  constructor(public developmentMode: boolean, public translations: Translations) {
    this.developmentMode = developmentMode;
  }

  enableFor(app: express.Express): void {
    app.set('view engine', 'njk');

    const nj = nunjucks.configure(path.join(__dirname, '..', '..', 'views'), {
      autoescape: true,
      watch: this.developmentMode,
      express: app,
    });

    app.use((req, res, next) => {
      res.locals.pagePath = req.path;

      nj.addGlobal('__', (key: string, values: { [key: string]: string } = {}) => {
        return this.translations.get(languages.Cy, '2', key, values);
      });
      nj.addFilter('t', (key: string, values: { [key: string]: string } = {}) => {
        return this.translations.get(languages.Cy, '2', key, values);
      });
      next();
    });
  }
}
