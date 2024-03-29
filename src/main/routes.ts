import * as os from 'os';

import { Route } from './constants';
import { History, InitSession, RequireIdam, SchemaValidator, ServiceAuthentication } from './middlewares';
import { InboundPayloadSchema } from './schemas';

import { infoRequestHandler } from '@hmcts/info-provider';
import config from 'config';
import { Application } from 'express';

const validator = new SchemaValidator();
const initSession = new InitSession();
const history = new History();

export default function (app: Application): void {
  // Home Controller
  app.get(Route.ROOT, app.locals.container.cradle.homeController.get);
  app.get(Route.OVERVIEW, initSession.init, history.add, app.locals.container.cradle.homeController.overview);
  app.get(Route.INTRO, initSession.init, history.add, app.locals.container.cradle.homeController.intro);
  app.get(Route.SIGN_OUT, app.locals.container.cradle.homeController.signOut);

  app.get(Route.COOKIES, history.add, app.locals.container.cradle.homeController.cookies);
  app.get(Route.PRIVACY_POLICY, history.add, app.locals.container.cradle.homeController.privacyPolicy);
  app.get(Route.TERMS_AND_CONDITIONS, history.add, app.locals.container.cradle.homeController.termsAndConditions);
  app.get(
    Route.ACCESSIBILITY_STATEMENT,
    history.add,
    app.locals.container.cradle.homeController.accessibilityStatement
  );

  // Demo Controller
  if (JSON.parse(config.get('demo.enabled'))) {
    app.get(Route.DEMO, history.add, app.locals.container.cradle.demoController.get);
    app.get(Route.START_DEMO, history.add, app.locals.container.cradle.demoController.startDemo);
    app.get(Route.DEMO_SERVICE_DUMMY, app.locals.container.cradle.demoController.serviceDummy);
  }

  // Review Controller
  app.get(Route.REVIEW, initSession.init, history.add, app.locals.container.cradle.reviewController.get);
  app.get(Route.SET_INACTIVE, initSession.init, app.locals.container.cradle.reviewController.setInactive);
  app.get(Route.SET_REQUESTED, initSession.init, app.locals.container.cradle.reviewController.setRequested);
  app.get(Route.CANCEL, initSession.init, app.locals.container.cradle.reviewController.cancel);
  app.post(Route.REVIEW, initSession.init, app.locals.container.cradle.reviewController.post);

  //DataController
  app.get(Route.DATA_PROCESS, app.locals.container.cradle.dataController.process);

  app.get(Route.BACK, (req, res) => {
    if (req.session.history && req.session.history.length > 1) {
      // Remove the current path
      req.session.history.pop();
      const previousPath = req.session.history.pop();

      if (previousPath) {
        return res.redirect(previousPath);
      }
    }

    return res.redirect(Route.CANCEL);
  });

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
  app.get(
    Route.JOURNEY_DISPLAY_FLAGS,
    initSession.init,
    history.add,
    app.locals.container.cradle.formController.display
  );
  app.post(Route.JOURNEY_DISPLAY_FLAGS, initSession.init, app.locals.container.cradle.formController.post);

  app.get(
    Route.INFO,
    infoRequestHandler({
      extraBuildInfo: {
        host: os.hostname(),
        name: 'cui-ra',
        uptime: process.uptime(),
      },
      info: {},
    })
  );
}
