import fs from 'fs';

import { PayloadCollectionItem } from './../interfaces';
import { ExistingFlagsManager } from './../managers';

import autobind from 'autobind-decorator';
import { Request, Response } from 'express';

@autobind
export class DemoController {
  public async get(req: Request, res: Response): Promise<void> {
    // Add code here to populate payloads/session for demo purposes.
    // Speak to Sonny about multiple versions to test blank payload and populated payload

    res.render('demo');
  }

  public async post(req: Request, res: Response): Promise<void> {
    const action = req.body.action;

    if (action === 'new') {
      // Redirect user to category page with enough payload data to render category flags
      // (This will need to mimic the data we should get back from refdata - see unit test mock data)

      res.redirect('home/intro'); // This will need to be the dynamic form once it has been pulled in
    } else if (action === 'existing') {
      // Redirect user to overview page with demo data
      const existingJson: PayloadCollectionItem[] = JSON.parse(
        fs.readFileSync(__dirname + '/../demo/data/demo-payload.json', 'utf-8')
      );

      const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
      dataManagerExisting.set(existingJson);

      req.session.partyname = 'Demo';
      req.session.existingmanager = dataManagerExisting;

      res.redirect('home/overview');
    } else {
      res.render('demo');
    }
  }
}