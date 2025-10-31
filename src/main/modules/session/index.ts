import { Logger } from '../../interfaces';

import config from 'config';
import { RedisStore } from 'connect-redis';
import { Application } from 'express';
import session from 'express-session';

import { createClient, type RedisClientType } from 'redis';

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
      const protocol = tlsOn ? 'rediss' : 'redis';
      const portOrDefault = port ?? 6380;
      const url = `${protocol}://:${key}@${host}:${portOrDefault}`;

      const client: RedisClientType = createClient({ url });

      client.on('error', err => this.logger.error(err));
      client.connect().catch(this.logger.error);

      // Azure Cache for Redis has issues with a 10 minute connection idle timeout, the recommendation is to keep the connection alive
      // https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md
      client.on('ready', () => {
        setInterval(() => {
          client.ping();
        }, 60_000); // 60s
      });
      const store = new RedisStore({ client });
      return store;
    }

    return undefined;
  }
}
