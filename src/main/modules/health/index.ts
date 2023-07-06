import os from 'os';

import healthcheck from '@hmcts/nodejs-healthcheck';
import config from 'config';
import { Application } from 'express';

/**
 * Sets up the HMCTS info and health endpoints
 */
export class HealthCheck {
  public enableFor(app: Application): void {
    const redis = app.locals.redisClient
      ? healthcheck.raw(() => app.locals.redisClient.ping().then(healthcheck.up).catch(healthcheck.down))
      : null;

    healthcheck.addTo(app, {
      checks: {
        ...(redis ? { redis } : {}),
        'service-auth': healthcheck.web(new URL('/health', config.get('services.s2s.endpoint'))),
        'reference-data': healthcheck.web(new URL('/health', config.get('services.refdata.endpoint'))),
      },
      readinessChecks: {
        redis,
      },
      buildInfo: {
        name: 'cui-ra',
        host: os.hostname(),
        uptime: process.uptime(),
      },
    });
  }
}
