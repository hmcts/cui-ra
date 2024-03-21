import * as path from 'path';

import { HTTPError } from './HttpError';
import { sanitizeRequest } from './middlewares/sanitizeRequestBody';
import {
  AppInsights,
  CSRFToken,
  Container,
  HealthCheck,
  Helmet,
  Nunjucks,
  PropertiesVolume,
  SessionStorage,
  Translation,
  languages,
} from './modules';
import routes from './routes';

import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import favicon from 'serve-favicon';

const { setupDev } = require('./development');

const { Logger } = require('@hmcts/nodejs-logging');

const env = process.env.NODE_ENV || 'development';
const instance = process.env.ENV_INSTANCE;
const developmentMode = env === 'development' || env === 'test';

export const app = express();
app.locals.ENV = env;
app.locals.ENV_INSTANCE = instance;
app.locals.developmentMode = developmentMode;
app.locals.appRoot = path.resolve(path.join(__dirname, '..', '..'));

const logger = Logger.getLogger('app');

// secure the application by adding various HTTP headers to its responses
new Helmet(developmentMode).enableFor(app);

app.use(favicon(path.join(__dirname, '/public/assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

new Translation().enableFor(app);
new PropertiesVolume().enableFor(app);
new Container().enableFor(app, logger);
new AppInsights().enable();
new HealthCheck().enableFor(app);
new SessionStorage(logger).enableFor(app);
new Nunjucks(developmentMode).enableFor(app);
new CSRFToken().enableFor(app);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

app.post('*', sanitizeRequest);

//Set up routes
routes(app);

setupDev(app, env === 'development');
// returning "not found" page for requests with paths not resolved by the router
app.use((req, res) => {
  res.status(404);
  res.render('error/404');
});

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: express.Request, res: express.Response, _next: NextFunction) => {
  logger.error(`${err.stack || err}`);
  const lang = req.session?.welsh ? languages.Cy : languages.En;
  res.locals._t = (key: string) => {
    const result = res.__({ phrase: `${key}`, locale: lang });
    return result !== key ? result : null;
  };
  res.locals._r = () => null;

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = developmentMode ? err : {};
  const httpStatus = err instanceof HTTPError ? err.status ?? 500 : 500;
  const template = httpStatus === 404 ? 'error/404' : 'error/500';
  res.status(httpStatus).render(template);
});
