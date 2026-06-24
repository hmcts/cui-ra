import fs from 'fs';
import path from 'path';

import { Route } from './../constants';
import { DataManagerDataObject, PayloadCollectionItem } from './../interfaces';
import { ExistingFlagsManager, NewFlagsManager } from './../managers';
import { ExistingFlagProcessor } from './../processors';
import { UrlRoute } from './../utilities';

import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';

@autobind
export class DemoController {
  private new: DataManagerDataObject[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'demo', 'data', 'data-processor-results.json'), 'utf-8')
  );

  private new_welsh: DataManagerDataObject[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'demo', 'data', 'data-processor-results-welsh.json'), 'utf-8')
  );

  private existing: PayloadCollectionItem[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'demo', 'data', 'demo-payload.json'), 'utf-8')
  );

  private BAA2: DataManagerDataObject[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'demo', 'data', 'BAA2-processor-results.json'), 'utf-8')
  );

  private BAA5: DataManagerDataObject[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'demo', 'data', 'BAA5-processor-results.json'), 'utf-8')
  );

  private new_party: DataManagerDataObject[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'demo', 'data', 'data-processor-results-party.json'), 'utf-8')
  );

  private ABA5: DataManagerDataObject[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'demo', 'data', 'ABA5-processor-results.json'), 'utf-8')
  );

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Add code here to populate payloads/session for demo purposes.
    // Speak to Sonny about multiple versions to test blank payload and populated payload
    try {
      req.session.hmctsserviceid = 'XXXX';
      req.session.history = [];
      req.session.masterflagcode = 'RA0001';
      req.session.mastername = 'Reasonable adjustment';
      req.session.mastername_cy = 'Addasiad rhesymol';
      req.session.partyname = 'john doe';

      res.render('demo');
    } catch (e) {
      next(e);
    }
  }

  public async startDemo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const action = req.query.action;
      const host = 'https://cui-ra.aat.platform.hmcts.net';

      switch (action) {
        case 'new': {
          const NewFlag = new NewFlagsManager();
          NewFlag.set(this.new);

          this.setSessionData(req, host, NewFlag, 'XXXX', false);

          return res.redirect(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001' }, UrlRoute.url(req)));
        }
        case 'new_cy': {
          const NewFlag = new NewFlagsManager();
          NewFlag.set(this.new_welsh);

          this.setSessionData(req, host, NewFlag, 'XXXX', true);

          return res.redirect(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001' }, UrlRoute.url(req)));
        }
        case 'BAA2': {
          const NewFlag = new NewFlagsManager();
          NewFlag.set(this.BAA2);

          this.setSessionData(req, host, NewFlag, 'BAA2', false);

          return res.redirect(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001' }, UrlRoute.url(req)));
        }
        case 'BAA5': {
          const NewFlag = new NewFlagsManager();
          NewFlag.set(this.BAA5);

          this.setSessionData(req, host, NewFlag, 'BAA5', false);

          return res.redirect(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001' }, UrlRoute.url(req)));
        }
        case 'existing': {
          const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
          const eprocessor = new ExistingFlagProcessor();
          dataManagerExisting.set(eprocessor.process(this.existing));

          const NewFlag = new NewFlagsManager();
          NewFlag.set(this.new);

          this.setSessionData(req, host, NewFlag, 'XXXX', false, dataManagerExisting);

          return res.redirect('home/overview');
        }
        case 'newparty': {
          const NewFlag = new NewFlagsManager();
          NewFlag.set(this.new_party);
          NewFlag.setMaster('PF0001');
          const master: DataManagerDataObject | null = NewFlag.setMaster('PF0001');
          req.session.masterflagcode = 'PF0001';
          if (master) {
            req.session.mastername = master.value.name;
            req.session.mastername_cy = master.value.name_cy;
          }

          this.setSessionData(req, host, NewFlag, 'XXXX', false);

          return res.redirect(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001' }, UrlRoute.url(req)));
        }
        case 'ABA5': {
          const NewFlag = new NewFlagsManager();
          NewFlag.set(this.ABA5);

          this.setSessionData(req, host, NewFlag, 'ABA5', false);

          return res.redirect(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001' }, UrlRoute.url(req)));
        }
      }
      return res.render('demo');
    } catch (e) {
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

  private setSessionData(
    req: Request,
    host: string,
    newManager: NewFlagsManager,
    hmctsServiceId: string,
    welsh: boolean,
    existingManager: ExistingFlagsManager = new ExistingFlagsManager()
  ): void {
    req.session.newmanager = newManager;
    req.session.existingmanager = existingManager;
    req.session.callbackUrl = `${host}${Route.DEMO_SERVICE_DUMMY}`;
    req.session.logoutUrl = `${host}${Route.ROOT}`;
    req.session.hmctsserviceid = hmctsServiceId;
    req.session.sessioninit = true;
    req.session.welsh = welsh;
  }
}
