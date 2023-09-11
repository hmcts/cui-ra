import * as os from 'os';

import { Route } from './constants';
import { InitSession, RequireIdam, SchemaValidator, ServiceAuthentication } from './middlewares';
import { InboundPayloadSchema } from './schemas';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

const validator = new SchemaValidator();
const initSession = new InitSession();

export default function (app: Application): void {
  // Home Controller
  app.get(Route.ROOT, app.locals.container.cradle.homeController.get);
  app.get(Route.OVERVIEW, app.locals.container.cradle.homeController.overview);
  app.get(Route.INTRO, app.locals.container.cradle.homeController.intro);

  app.get(Route.COOKIES, app.locals.container.cradle.homeController.cookies);
  app.get(Route.PRIVACY_POLICY, app.locals.container.cradle.homeController.privacyPolicy);
  app.get(Route.TERMS_AND_CONDITIONS, app.locals.container.cradle.homeController.termsAndConditions);
  app.get(Route.ACCESSIBILITY_STATEMENT, app.locals.container.cradle.homeController.accessibilityStatement);

  // Demo Controller
  //if (app.locals.ENV !== 'production') {
  app.get(Route.DEMO, initSession.init, app.locals.container.cradle.demoController.get);
  app.get(Route.START_DEMO, initSession.init, app.locals.container.cradle.demoController.startDemo);
  //}

  // Review Controller
  app.get(Route.REVIEW, initSession.init, app.locals.container.cradle.reviewController.get);
  app.get(Route.SET_INACTIVE, initSession.init, app.locals.container.cradle.reviewController.setInactive);
  app.get(Route.SET_REQUESTED, initSession.init, app.locals.container.cradle.reviewController.setRequested);

  //DataController
  app.get(Route.DATA_PROCESS, initSession.init, app.locals.container.cradle.dataController.process);

  //Secure api
  app.use(Route.API_ROOT, new ServiceAuthentication(app.locals.container.cradle.serviceAuth).check);

  app.get(Route.BACK, (req, res) => {
    console.log('GO BACK');
    console.log(req.session.history);
    // Navigate back in history if possible
    if (req.session.history && req.session.history.length > 1) {
      req.session.history.pop(); // Remove the current path
      const previousPath = req.session.history.pop(); // Get the previous path
      if (previousPath) {
        res.redirect(previousPath); // Redirect back to the previous path
        console.log(req.session.history);
      } else {
        res.send('No more history to navigate back');
      }
    } else {
      res.send('No more history to navigate back');
    }
  });

  //Load all api routes
  app.post(
    Route.API_POST_PAYLOAD,
    [new RequireIdam().check, validator.check(InboundPayloadSchema)],
    app.locals.container.cradle.apiController.postPayload
  );
  app.get(Route.API_GET_PAYLOAD, app.locals.container.cradle.apiController.getPayload);

  // Form Controller
  app.get(Route.JOURNEY_DISPLAY_FLAGS, initSession.init, app.locals.container.cradle.formController.display);
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
