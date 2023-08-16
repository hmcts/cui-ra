import { Route, Status } from './../constants';

import autobind from 'autobind-decorator';
import { Request, Response } from 'express';
import { DataManagerDataObject } from '../interfaces';

@autobind
export class ReviewController {
  public async get(req: Request, res: Response): Promise<void> {
    res.render('review', {
      welsh: false,
      requested: req.session.existingmanager?.find('value.status', 'Requested'),
      new: req.session.newmanager?.find('_enabled', true)?.filter((item:DataManagerDataObject) => item._isParent === false),
      notRequired: req.session.existingmanager?.find('value.status', 'Inactive') || [],
      route: Route,
    });
  }

  public async setRequested(req: Request, res: Response): Promise<void> {
    const id: string = req.query.id as string;

    if (req.session.existingmanager?.get(id)?.value.status === Status.INACTIVE) {
      req.session.existingmanager?.setStatus(id, Status.REQUESTED);
    }

    res.redirect(Route.REVIEW);
  }

  public async setInactive(req: Request, res: Response): Promise<void> {
    const id: string = req.query.id as string;

    if (req.session.existingmanager?.get(id)?.value.status === Status.REQUESTED) {
      req.session.existingmanager?.setStatus(id, Status.INACTIVE);
    }

    res.redirect(Route.REVIEW);
  }
}
