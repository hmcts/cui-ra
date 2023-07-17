import * as os from 'os';

import { RequireIdam, ServiceAuthentication } from './middlewares';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

export default function (app: Application): void {
  app.get('/', app.locals.container.cradle.homeController.get);

  //Secure api
  app.use('/api/*', new ServiceAuthentication(app.locals.container.cradle.serviceAuth).check);

  //Load all api routes
  app.post('/api/payload', new RequireIdam().check, app.locals.container.cradle.apiController.postPayload);
  app.get('/api/payload/:id', app.locals.container.cradle.apiController.getPayload);

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
