import * as os from 'os';

import { RequireIdam, ServiceAuthentication } from './middlewares';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

export default function (app: Application): void {
  // Home Controller
  app.get('/', app.locals.container.cradle.homeController.get);
  app.get('/home/overview', app.locals.container.cradle.homeController.overview);
  app.get('/home/intro', app.locals.container.cradle.homeController.intro);

  //Secure api
  app.use('/api/*', new ServiceAuthentication(app.locals.container.cradle.serviceAuth).check);

  //Load all api routes
  app.post('/api/payload', new RequireIdam().check, app.locals.container.cradle.apiController.postPayload);
  app.get('/api/payload/:id', app.locals.container.cradle.apiController.getPayload);

  // Form Controller
  app.get('/form/dynamic-form', app.locals.container.cradle.formController.get);

  app.get(
    '/info',
    infoRequestHandler({
      extraBuildInfo: {
        host: os.hostname(),
        name: 'expressjs-template',
        uptime: process.uptime(),
      },
      info: {},
    })
  );
}
