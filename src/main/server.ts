#!/usr/bin/env node
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import 'reflect-metadata';

import { app } from './app';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('server');

// TODO: set the right port for your application
const port: number = parseInt(process.env.PORT || '3100', 10);
const env = app.locals.ENV_INSTANCE;

if (app.locals.ENV === 'development') {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');
  const sslOptions = {
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
  };
  const server = https.createServer(sslOptions, app);
  server.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}, env: ${env}`);
  });
} else {
  app.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}, env: ${env}`);
  });
}
