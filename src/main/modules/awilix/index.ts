import { ApiController, FormController, DataController, HomeController } from './../../controllers';
import { Logger } from './../../interfaces';
import { FlagProcessor } from './../../processors';
import { FileStorageClient, RedisClient, RefData, S2S } from './../../services';

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
      redisClient:
        app.locals.ENV === 'test'
          ? asClass(FileStorageClient)
          : asClass(RedisClient)
              .singleton()
              .inject(() => ({
                host: config.get('session.redis.host'),
                port: config.get('session.redis.port'),
                key: config.get('session.redis.key'),
              })),
      flagProcessor: asClass(FlagProcessor),
      homeController: asClass(HomeController),
      apiController: asClass(ApiController),
      formController: asClass(FormController),
      dataController: asClass(DataController),
    });
    app.locals.container = container;
  }
}
