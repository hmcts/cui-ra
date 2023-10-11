import * as fs from 'fs';
import * as path from 'path';

import { ServiceConfigFlagInterface, ServiceConfigInterface } from './../interfaces';

export class ServiceConfig {
  private basedir = `${__dirname}/../resources/configs`;

  private default = path.join(this.basedir, 'default.json');

  private servicedir = path.join(this.basedir, 'services');

  private config: ServiceConfigInterface;

  constructor(id: string | null = null) {
    this.config = this.get(id);
  }

  public getConfig(): ServiceConfigInterface {
    return this.config;
  }

  public getConfigValue(key: string): string | boolean | number | object | null {
    // Split the key by dots to access nested properties.
    const keys = key.split('.');
    let currentValue = this.config;

    for (const k of keys) {
      if (currentValue.hasOwnProperty(k)) {
        currentValue = currentValue[k];
      } else {
        return null;
      }
    }
    return currentValue;
  }

  public getFlags(): ServiceConfigFlagInterface[] {
    return this.config.flags || [];
  }

  private getServiceDir(id: string): string {
    return path.join(this.servicedir, `${id}.json`);
  }

  private load(dir: string): ServiceConfigInterface {
    if (!fs.existsSync(dir)) {
      return JSON.parse('{}');
    }
    return JSON.parse(fs.readFileSync(dir, 'utf-8'));
  }

  private get(id: string | null = null): ServiceConfigInterface {
    const defaultConfig = this.load(this.default);
    if (!id) {
      return defaultConfig;
    }
    //load and merge
    const serviceConfig = this.load(this.getServiceDir(id));

    return this.mergeObjects(defaultConfig, serviceConfig);
  }

  private mergeObjects(target, ...sources) {
    sources.forEach(source => {
      Object.keys(source).forEach(key => {
        if (!source.hasOwnProperty(key)) {
          return;
        }
        if (key === '__proto__' || key === 'constructor') {
          return;
        }
        const s_val = source[key];
        const t_val = target[key];
        target[key] =
          t_val && s_val && typeof t_val === 'object' && typeof s_val === 'object'
            ? this.mergeObjects(t_val, s_val)
            : s_val;
      });
    });

    return target;
  }
}
