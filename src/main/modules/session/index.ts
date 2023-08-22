import { Logger } from '../../interfaces';

import config from 'config';
import RedisStore from 'connect-redis';
import { Application } from 'express';
import session from 'express-session';
import FileStoreFactory from 'session-file-store';

const Redis = require('ioredis');
const FileStore = FileStoreFactory(session);

export class SessionStorage {
  constructor(private logger: Logger) {}

  public enableFor(app: Application): void {
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
        store: new FileStore({ path: '/tmp' }), //this.getStore(),
      })
    );
  }

  private getStore() {
    const host = config.get('session.redis.host');
    const port = config.get('session.redis.port');
    const key = config.get('session.redis.key');

    if (host && host !== '') {
      const client = new Redis({
        host: host as string,
        port: port as number,
        password: key as string,
      });

      client.on('error', this.logger.error);

      return new RedisStore({ client });
    }

    return new FileStore({ path: '/tmp' });
  }
}
