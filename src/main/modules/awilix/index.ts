import { HomeController } from './../../controllers';
import { S2S } from './../../services';

import { InjectionMode, asClass, createContainer } from 'awilix';
import { Application } from 'express';

export class Container {
  public enableFor(app: Application): void {
    const container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });
    container.register({
      s2s: asClass(S2S).singleton(),
      //homeController: asClass(HomeController),
      homeController: asClass(HomeController)
        .singleton()
        .inject(() => ({
          s2s: container.resolve<S2S>('s2s'),
        })),
    });
    app.locals.container = container;
  }
}
