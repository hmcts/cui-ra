import os from 'os';

//import { RedisClientInterface } from './../../interfaces';

import healthcheck from '@hmcts/nodejs-healthcheck';
//import config from 'config';
import { Application } from 'express';

/**
 * Sets up the HMCTS info and health endpoints
 */
export class HealthCheck {
  public enableFor(app: Application): void {
    //const redisClient: RedisClientInterface = app.locals.container.cradle.redisClient;

    // const redis = healthcheck.raw(() => {
    //   if (redisClient.isConnected()) {
    //     healthcheck.up;
    //   } else {
    //     healthcheck.down;
    //   }
    // });

    healthcheck.addTo(app, {
      checks: {
        sampleCheck: healthcheck.raw(() => healthcheck.up()),
        //...redis,
        //'service-auth': healthcheck.web(new URL('/health', config.get('services.s2s.endpoint'))),
        //'reference-data': healthcheck.web(new URL('/health', config.get('services.refdata.endpoint'))),
      },
      readinessChecks: {
        //redis,
      },
      buildInfo: {
        name: 'cui-ra',
        host: os.hostname(),
        uptime: process.uptime(),
      },
    });
  }
}
