import fs from 'fs';
import path from 'path';

import { Route } from './../constants';
import { DataManagerDataObject, PayloadCollectionItem } from './../interfaces';
import { ExistingFlagsManager, NewFlagsManager } from './../managers';
import { UrlRoute } from './../utilities';

import autobind from 'autobind-decorator';
import { Request, Response } from 'express';

@autobind
export class DemoController {
  private new: DataManagerDataObject[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'demo', 'data', 'data-processor-results.json'), 'utf-8')
  );

  private existing: PayloadCollectionItem[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'demo', 'data', 'demo-payload.json'), 'utf-8')
  );

  public async get(req: Request, res: Response): Promise<void> {
    // Add code here to populate payloads/session for demo purposes.
    // Speak to Sonny about multiple versions to test blank payload and populated payload

    res.render('demo');
  }

  public async startDemo(req: Request, res: Response): Promise<void> {
    const action = req.query.action;

    if (action === 'new') {
      // Redirect user to category page with enough payload data to render category flags
      // (This will need to mimic the data we should get back from refdata - see unit test mock data)
      const NewFlag = new NewFlagsManager();
      NewFlag.set(this.new);

      req.session.masterflagcode = 'RA0001';
      req.session.mastername = 'Reasonable Adjustments';
      req.session.partyname = 'john doe';
      req.session.newmanager = NewFlag;
      req.session.existingmanager = new ExistingFlagsManager();

      return res.redirect(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001' }, UrlRoute.url(req)));
    } else if (action === 'existing') {
      // Redirect user to overview page with demo data
      const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
      dataManagerExisting.set(this.existing);

      const NewFlag = new NewFlagsManager();
      NewFlag.set(this.new);

      req.session.masterflagcode = 'RA0001';
      req.session.mastername = 'Reasonable Adjustments';
      req.session.partyname = 'john doe';
      req.session.existingmanager = dataManagerExisting;
      req.session.newmanager = NewFlag;

      res.redirect('home/overview');
    } else {
      res.render('demo');
    }
  }
}
