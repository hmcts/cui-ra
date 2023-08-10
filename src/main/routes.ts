import * as os from 'os';

import { Route } from './constants';
import { RequireIdam, SchemaValidator, ServiceAuthentication } from './middlewares';
import { InboundPayloadSchema } from './schemas';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

const validator = new SchemaValidator();

export default function (app: Application): void {
  // Home Controller
  app.get(Route.ROOT, app.locals.container.cradle.homeController.get);
  app.get(Route.OVERVIEW, app.locals.container.cradle.homeController.overview);
  app.get(Route.INTRO, app.locals.container.cradle.homeController.intro);

  //Secure api
  app.use(Route.API_ROOT, new ServiceAuthentication(app.locals.container.cradle.serviceAuth).check);

  //Load all api routes
  app.post(
    Route.API_POST_PAYLOAD,
    [new RequireIdam().check, validator.check(InboundPayloadSchema)],
    app.locals.container.cradle.apiController.postPayload
  );
  app.get(Route.API_GET_PAYLOAD, app.locals.container.cradle.apiController.getPayload);

  // Form Controller
  app.get(Route.JOURNEY_DISPLAY_FLAGS, app.locals.container.cradle.formController.display);
  app.post(Route.JOURNEY_DISPLAY_FLAGS, app.locals.container.cradle.formController.post);

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
