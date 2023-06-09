import { HomeController } from './../../controllers';

import { InjectionMode, asClass, createContainer } from 'awilix';
import { Application } from 'express';
//import config from 'config';

export class Container {
  public enableFor(app: Application): void {
    app.locals.container = createContainer({ injectionMode: InjectionMode.CLASSIC }).register({
      homeController: asClass(HomeController),
    });
  }
}
