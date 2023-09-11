import * as path from 'path';

import { HTTPError } from './HttpError';

import {
  AppInsights,
  Container,
  HealthCheck,
  Helmet,
  Nunjucks,
  PropertiesVolume,
  SessionStorage,
  Translation,
} from './modules';
import routes from './routes';

import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import favicon from 'serve-favicon';

const { setupDev } = require('./development');

const { Logger } = require('@hmcts/nodejs-logging');

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = express();
app.locals.ENV = env;
app.locals.appRoot = path.resolve(path.join(__dirname, '..', '..'));

const logger = Logger.getLogger('app');

app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

new PropertiesVolume().enableFor(app);
new Container().enableFor(app, logger);
new AppInsights().enable();
new SessionStorage(logger).enableFor(app);
new Translation().enableFor(app);
new Nunjucks(developmentMode).enableFor(app);
// secure the application by adding various HTTP headers to its responses
new Helmet(developmentMode).enableFor(app);
new HealthCheck().enableFor(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req: Request, res: Response, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});

//Set up routes
routes(app);

setupDev(app, developmentMode);
// returning "not found" page for requests with paths not resolved by the router
app.use((req, res) => {
  res.status(404);
  res.render('error/404');
});

// error handler
app.use((err: HTTPError, req: express.Request, res: express.Response) => {
  logger.error(`${err.stack || err}`);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = env === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('/error/500');
});
