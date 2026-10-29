import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';
import {localServiceMappings} from '../../../config/localServiceMappings';

@autobind
export class InvokerController {
  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Add code here to populate payloads/session for demo purposes.
    try {
      // these shouldn't be static - setting for now
      // fetch from service/config ?
      req.session.hmctsserviceid = 'XXXX'; // fetch when service is selected
      req.session.history = [];
      req.session.masterflagcode = 'RA0001';
      req.session.mastername = 'Reasonable adjustment'; // welsh translation, language interpreter
      req.session.mastername_cy = 'Addasiad rhesymol';
      req.session.partyname = 'john doe';

      res.render('invoker');
    } catch (e) {
      next(e);
    }
  }

  public async startInvoker(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = req.query.journey;

      console.log(`Service selected: ${service}`);

      const mapping = service ? localServiceMappings[service.toString()] : undefined;

      if (!mapping) {
        console.log(`No mapping found for service: ${service}`);
        return
      }

      const serviceId = mapping[0];

      console.log(service, serviceId);

      return res.render('invoker');
    }
    catch (e) {
      next(e);
    }
  }

  public async serviceDummy(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const id = req.params.id;

      return res.send(
        `This is a service dummy page. Copy the id: ${id} and use it in the get request to get the payload`
      );
    } catch (e) {
      return next(e);
    }
  }

  /*private setSessionData(
    req: Request,
    host: string,
    newManager: NewFlagsManager,
    hmctsServiceId: string,
    welsh: boolean,
    existingManager: ExistingFlagsManager = new ExistingFlagsManager()
  ): void {}*/
}
