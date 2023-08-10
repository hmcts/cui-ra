import { RedisClientInterface } from './../../interfaces';
import { ExistingFlagsManager, NewFlagsManager } from './../../managers';

import { plainToClass } from 'class-transformer';
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
    //populate response from session data
    app.use((req, res, next) => {
      res.locals.partyname = req.session.partyname;
      res.locals.mastername = req.session.mastername;
      res.locals.mastername_cy = req.session.mastername_cy;

      //init to class from json
      if (req.session.existingmanager && typeof req.session.existingmanager !== typeof ExistingFlagsManager) {
        req.session.existingmanager = plainToClass(ExistingFlagsManager, req.session.existingmanager);
      } else if (!req.session.existingmanager) {
        req.session.existingmanager = new ExistingFlagsManager();
      }

      //init to class from json
      if (req.session.newmanager && typeof req.session.newmanager !== typeof NewFlagsManager) {
        req.session.newmanager = plainToClass(NewFlagsManager, req.session.newmanager);
      } else if (!req.session.newmanager) {
        req.session.newmanager = new NewFlagsManager();
      }

      next();
    });
  }

  private getStore() {
    const client = this.redisClient.getClient();
    if ((config.get('session.redis.host') as string) && client) {
      return new RedisStore({ client });
    }

    return new FileStore({ path: '/tmp' });
  }
}
