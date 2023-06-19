import path from 'path';

import * as propertiesVolume from '@hmcts/properties-volume';
import config from 'config';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {
  enableFor(server: Application): void {
    if (server.locals.ENV === 'development') {
      propertiesVolume.addTo(config, { mountPoint: path.resolve(server.locals.appRoot, 'secrets/') });
    } else {
      propertiesVolume.addTo(config);
    }
    this.setSecret('secrets.cui.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
    this.setSecret('secrets.cui.s2s-secret', 'services.s2s.secret');
  }

  private setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }
}
