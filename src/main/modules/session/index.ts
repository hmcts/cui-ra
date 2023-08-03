import { RedisClientInterface } from './../../interfaces';

import config from 'config';
import RedisStore from 'connect-redis';
import { Application } from 'express';
import session from 'express-session';
import FileStoreFactory from 'session-file-store';

const FileStore = FileStoreFactory(session);

export class SessionStorage {
  constructor(private redisClient: RedisClientInterface) {}

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
        store: this.getStore(),
      })
    );
  }

  private getStore() {
    const client = this.redisClient.getClient();
    if ((config.get('session.redis.host') as string) && client) {
      return new RedisStore({ client });
    }

    return new FileStore({ path: '/tmp' });
  }
}
