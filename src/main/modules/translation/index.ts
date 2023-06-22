import * as path from 'path';

import * as express from 'express';

const { I18n } = require('i18n');

export class Translation {
  enableFor(app: express.Express): void {
    const i18n = new I18n();

    i18n.configure({
      locales: ['en', 'cy'],
      defaultLang: 'en',
      queryParameter: 'lang',
      cookie: 'lang_cookie_name',
      directory: path.join(__dirname, '/../../resources/translation/'),
    });

    app.use(i18n.init);
  }
}
