import * as fs from 'fs';
import * as path from 'path';

import * as express from 'express';

const { I18n } = require('i18n');

export enum languages {
  En = 'en',
  Cy = 'cy',
}

export class Translation {
  enableFor(app: express.Express): void {
    const i18n = new I18n();

    i18n.configure({
      locales: [languages.En, languages.Cy],
      //fallbacks: { 'cy': 'en' },
      defaultLocale: languages.En,
      retryInDefaultLocale: true,
      queryParameter: 'lang',
      cookie: 'lang',
      objectNotation: true,
      autoReload: true,
      staticCatalog: this.getAllTranslations(),
    });

    app.use(i18n.init);
  }

  private getAllTranslations(): { [key: string]: object } {
    const translations = {} as { [key: string]: object };
    for (const lang of Object.values(languages)) {
      translations[lang] = this.getTranslations(lang);
    }
    return translations;
  }

  private getTranslations(lang: languages): object {
    return this.loadTranslations(`${__dirname}/../../resources/translation/${lang}`);
  }

  private loadTranslations(directory: string): object {
    let translations = {};

    const files = fs.readdirSync(directory);
    files.forEach((file: string) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        const dirTranslations = this.loadTranslations(filePath);
        this.mergeObjects(translations, dirTranslations);
      } else if (file.endsWith('.json')) {
        const translationData = require(filePath);
        this.mergeObjects(translations, translationData);
      }
    });

    return translations;
  }

  private mergeObjects (target, ...sources) {
    sources.forEach(source => {
      Object.keys(source).forEach(key => {
        const s_val = source[key]
        const t_val = target[key]
        target[key] = t_val && s_val && typeof t_val === 'object' && typeof s_val === 'object'
                    ? this.mergeObjects(t_val, s_val)
                    : s_val
      })
    })
    
    return target
  }
}
