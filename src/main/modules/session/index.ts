import { Logger } from '../../interfaces';

import config from 'config';
import RedisStore from 'connect-redis';
import { Application } from 'express';
import session from 'express-session';
import FileStoreFactory from 'session-file-store';

const Redis = require('ioredis');

export class SessionStorage {
  constructor(private logger: Logger) {}

  public enableFor(app: Application): void {
    // BJ - app.locals.developmentMode is undefined here - This is a problem
    // app.set('trust proxy', 1);

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
          secure: !app.locals.developmentMode,
        },
        rolling: true, // Renew the cookie for another 20 minutes on each request
        store: this.getStore(),
      })
    );
  }

  private getStore() {
    //const redisStore = RedisStore(session);
    const fileStore = FileStoreFactory(session);

    const host: string = config.get('session.redis.host');
    const port: number = config.get('session.redis.port');
    const key: string = config.get('session.redis.key');
    //const tls: boolean = JSON.parse(config.get('session.redis.tls'));

    if (host && key) {
      const client = new Redis({
        host,
        port: port ?? 6380,
        password: key,
        tls: true,
      });

      /*
      if (tls === true) {
        client.tls = true;
        this.logger.info('TLS Enabled on Redis Client');
      }
      */

      client.on('error', this.logger.error);

      return new RedisStore({ client });
    }

    return new fileStore({ path: '/tmp' });
  }
}
