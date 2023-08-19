import { ExistingFlagsManager, NewFlagsManager } from './../managers';

import { plainToClass } from 'class-transformer';

import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';

@autobind
export class InitSession {
  public async init(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    if (!req.session) {
        next();
    }
    res.locals.partyname = req.session.partyname;
    res.locals.mastername = req.session.mastername;
    res.locals.mastername_cy = req.session.mastername_cy;

    try {
      //init to class from json
      if (req.session.existingmanager && typeof req.session.existingmanager !== typeof ExistingFlagsManager) {
        req.session.existingmanager = plainToClass(ExistingFlagsManager, req.session.existingmanager);
      }
      //init to class from json
      if (req.session.newmanager && typeof req.session.newmanager !== typeof NewFlagsManager) {
        req.session.newmanager = plainToClass(NewFlagsManager, req.session.newmanager);
      }
    } finally {
        next();
    }

  }
}
