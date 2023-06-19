import { HomeController } from './../../controllers';
import { S2S } from './../../services';

import { InjectionMode, asClass, asValue, createContainer } from 'awilix';
import axios from 'axios';
import config from 'config';
import { Application } from 'express';

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

export class Container {
  public enableFor(app: Application): void {
    const container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });
    container.register({
      logger: asValue(logger),
      s2s: asClass(S2S)
        .singleton()
        .inject(() => ({
          secret: config.get('services.s2s.secret'),
          service: config.get('serviceName'),
          client: axios.create({
            baseURL: config.get('services.s2s.endpoint'),
          }),
        })),
      //homeController: asClass(HomeController),
      homeController: asClass(HomeController)
        .singleton()
        .inject(() => ({
          S2S: container.resolve<S2S>('s2s'),
        })),
    });
    app.locals.container = container;
  }
}
