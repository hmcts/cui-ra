import * as fs from 'fs';
import * as path from 'path';

import * as express from 'express';

export enum languages {
  En = 'en',
  Cy = 'cy',
}

export class Translations {
  private translation_store: { [key: string]: object } = {};
  private fallback: languages = languages.En;

  constructor() {
    this.translation_store = this.getAllTranslations();
  }

  enableFor(app: express.Express): void {
    app.use((req, res, next) => {
      //req.locals.lang = languages.En,
      next();
    });
  }

  public get(
    language: languages = languages.En,
    service: string | null = null,
    key: string,
    values: { [key: string]: string } = {}
  ): string | undefined {
    return this.replace(this.getAndFallback(language, service, key), values);
  }

  private getAndFallback(language: languages, service: string | null, key: string): string | undefined {
    let result = undefined;
    const serviceKey = `${service}.${key}`;

    //try get service specific value first
    if (service) {
      result = this.getValueByKeyPath(this.translation_store[language], serviceKey);
    }

    if (!result) {
      result = this.getValueByKeyPath(this.translation_store[language], key);
    }

    if (!result && language !== this.fallback) {
      //attempt fallback
      result = this.getAndFallback(this.fallback, service, key);
    }

    return result;
  }

  private getValueByKeyPath(obj: object, keyPath: string): string | undefined {
    if (!obj) {
      return undefined;
    }
    const keys = keyPath.split('.');
    let value: { [key: string]: object } | string = obj as { [key: string]: object };
    for (const key of keys) {
      if (typeof value !== 'object' || value === null || !(key in value)) {
        return undefined;
      }
      value = value[key] as { [key: string]: object } | string;
    }
    if (typeof value !== 'string') {
      return undefined;
    }
    return value;
  }

  private replace(text: string | undefined, values: { [key: string]: string } = {}): string | undefined {
    if (!values || !text) {
      return text;
    }
    const reg = /\{([^}]+)\}/g;
    return text.replace(reg, (matched: string, key: string) => values[key] || matched);
  }

  public getAllTranslations(): { [key: string]: object } {
    const translations = {} as { [key: string]: object };
    for (const lang of Object.values(languages)) {
      translations[lang] = this.getTranslations(lang);
    }
    return translations;
  }

  public getTranslations(lang: languages): object {
    return this.loadTranslations(`${__dirname}/../../resources/translation/${lang}`);
  }

  private loadTranslations(directory: string): object {
    const translations = {};

    const files = fs.readdirSync(directory);
    files.forEach((file: string) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        const dirTranslations = this.loadTranslations(filePath);
        Object.assign(translations, dirTranslations);
      } else if (file.endsWith('.json')) {
        const translationData = require(filePath);
        Object.assign(translations, translationData);
      }
    });

    return translations;
  }
}
