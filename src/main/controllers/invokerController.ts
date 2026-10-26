import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';


@autobind
export class InvokerController {
  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Add code here to populate payloads/session for demo purposes.
    try {
      // these shouldn't be static - setting for now
      req.session.hmctsserviceid = 'XXXX';
      req.session.history = [];
      req.session.masterflagcode = 'RA0001';
      req.session.mastername = 'Reasonable adjustment';
      req.session.mastername_cy = 'Addasiad rhesymol';
      req.session.partyname = 'john doe';

      res.render('invoker');
    } catch (e) {
      next(e);
    }
  }

  public async chooseJourney(req: Request, res: Response, next: NextFunction): Promise<void> {}

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
