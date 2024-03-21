import { ServiceAuth } from './../../main/interfaces';
import { ErrorMessages, HeaderParams } from './../constants';

import autobind from 'autobind-decorator';
import config from 'config';
import { NextFunction, Request, Response } from 'express';

@autobind
export class ServiceAuthentication {
  constructor(private serviceAuth: ServiceAuth) {}

  public async check(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    let serviceToken: string | string[] | undefined;
    try {
      serviceToken = req.headers[HeaderParams.SERVICE_TOKEN];
    } catch {
      return res.status(401).json({ error: ErrorMessages.SERVICE_TOKEN_MISSING });
    }

    if (typeof serviceToken !== 'string') {
      return res.status(400).json({ error: ErrorMessages.SERVICE_TOKEN_INCORRECT_FORMAT });
    }

    try {
      const service = await this.serviceAuth.validateToken(serviceToken);
      const allowedServices: string[] = config.get('services.s2s.allowedServices') ?? [];
      if (service && allowedServices.includes(service.toLowerCase())) {
        next();
      } else {
        throw new Error(ErrorMessages.UNAUTHORISED);
      }
    } catch (ex) {
      return res.status(401).json({ error: ErrorMessages.UNAUTHORISED });
    }
  }
}
