import { Application } from 'express';

export default function (app: Application): void {
  app.get('/', app.locals.container.cradle.homeController.get);
}
