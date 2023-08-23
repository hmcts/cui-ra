import { Status } from '../constants';

import autobind from 'autobind-decorator';
import { Request, Response } from 'express';

@autobind
export class HomeController {
  public async get(req: Request, res: Response): Promise<void> {
    res.render('home');
  }

  public async overview(req: Request, res: Response): Promise<void> {
    // Add checks here to ensure the required data is on the session???

    res.render('overview', {
      existingFlags: req.session.existingmanager?.data,
      name: req.session.partyname,
      status: Status,
    });
  }

  public async intro(req: Request, res: Response): Promise<void> {
    res.render('intro');
  }
}
