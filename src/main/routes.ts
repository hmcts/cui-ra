import * as os from 'os';

import { Route } from './constants';
import { RequireIdam, SchemaValidator, ServiceAuthentication } from './middlewares';
import { InboundPayloadSchema } from './schemas';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

const validator = new SchemaValidator();

export default function (app: Application): void {
  app.get(Route.ROOT, app.locals.container.cradle.homeController.get);

  //DataController
  app.get(Route.DATA_PROCESS, app.locals.container.cradle.dataController.process);

  //Secure api
  app.use(Route.API_ROOT, new ServiceAuthentication(app.locals.container.cradle.serviceAuth).check);

  //Load all api routes
  app.post(
    Route.API_POST_PAYLOAD,
    [new RequireIdam().check, validator.check(InboundPayloadSchema)],
    app.locals.container.cradle.apiController.postPayload
  );
  app.get(Route.API_GET_PAYLOAD, app.locals.container.cradle.apiController.getPayload);

  app.get(
    Route.INFO,
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
