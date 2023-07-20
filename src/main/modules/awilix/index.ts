import { ApiController, HomeController, FormController } from './../../controllers';
import { Logger } from './../../interfaces';
import { RefData, S2S } from './../../services';

import { InjectionMode, asClass, asValue, createContainer } from 'awilix';
import axios from 'axios';
import config from 'config';
import { Application } from 'express';

export class Container {
  public enableFor(app: Application, logger: Logger): void {
    const container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });
    container.register({
      logger: asValue(logger),
      serviceAuth: asClass(S2S)
        .singleton()
        .inject(() => ({
          secret: config.get('services.s2s.secret'),
          service: config.get('serviceName'),
          client: axios.create({
            baseURL: config.get('services.s2s.endpoint'),
          }),
        })),
      refdata: asClass(RefData)
        .singleton()
        .inject(() => ({
          client: axios.create({
            baseURL: config.get('services.refdata.endpoint'),
          }),
        })),
      homeController: asClass(HomeController),
      apiController: asClass(ApiController),
      formController: asClass(FormController),
    });
    app.locals.container = container;
  }
}
