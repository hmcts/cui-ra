import { Logger } from '../../interfaces';

import config from 'config';
import RedisStore from 'connect-redis';
import { Application } from 'express';
import session from 'express-session';

const Redis = require('ioredis');

export class SessionStorage {
  constructor(private logger: Logger) {}

  public enableFor(app: Application): void {
    if (!app.locals.developmentMode) {
      app.set('trust proxy', 1);
    }
    app.use(
      session({
        name: 'cui-session',
        resave: false,
        saveUninitialized: false,
        secret: config.get('session.secret'),
        cookie: {
          httpOnly: true,
          maxAge: config.get('session.maxAge'),
          sameSite: 'lax', // required for the oauth2 redirect
          secure: config.get('session.secure'),
        },
        rolling: true, // Renew the cookie for another 20 minutes on each request
        store: this.getStore(),
      })
    );
  }

  private getStore() {
    const host: string = config.get('session.redis.host');
    const port: number = config.get('session.redis.port');
    const key: string = config.get('session.redis.key');
    const tlsOn: boolean = JSON.parse(config.get('session.redis.tls'));

    if (host && key) {
      const redisConfig = {
        host,
        port: port ?? 6380,
        password: key,
        retryStrategy: times => {
          // Use a custom retry strategy if needed
          return Math.min(times * 50, 2000);
        },
      };

      if (tlsOn === true) {
        this.logger.info('TLS Enabled on Redis Client');
        Object.assign(redisConfig, {
          tls: true,
        });
      }
      const client = new Redis(redisConfig);

      // Azure Cache for Redis has issues with a 10 minute connection idle timeout, the recommendation is to keep the connection alive
      // https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md
      client.on('ready', () => {
        setInterval(() => {
          client.ping();
        }, 60000); // 60s
      });

      client.on('error', this.logger.error);
      const store = new RedisStore({
        client,
      });
      return store;
    }

    return undefined;
  }
}
