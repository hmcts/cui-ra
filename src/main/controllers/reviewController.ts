import fs from 'fs';

import { Route, Status } from './../constants';
import { DataManagerDataObject } from './../interfaces';
import { ExistingFlagsManager, NewFlagsManager } from './../managers';
import { FlagProcessor } from './../processors';
import { DataTimeUtilities } from './../utilities';

import autobind from 'autobind-decorator';
import { Request, Response } from 'express';

@autobind
export class ReviewController {
  public async get(req: Request, res: Response): Promise<void> {
    // Existing flags
    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
    dataManagerExisting.set(req.session.existingmanager?.data || []);

    // New flags
    const newJson = JSON.parse(fs.readFileSync(__dirname + '/../../test/unit/data/flags.json', 'utf-8'));
    const flagProcessor = new FlagProcessor();

    // Process the refdata
    const processedData: DataManagerDataObject[] = flagProcessor.process(
      DataTimeUtilities.getDateTime(),
      newJson.flags[0].FlagDetails
    );

    const dataManagerNew: NewFlagsManager = new NewFlagsManager();
    dataManagerNew.set(processedData);

    res.render('review', {
      welsh: false,
      partyName: req.session.partyname,
      requested: dataManagerExisting.find('status', 'Requested'),
      //new: dataManagerNew.find("_enabled", "true"),
      new: dataManagerNew.find('status', 'Requested').splice(18), // To be replaced with _enabled once work has been completed
      notRequired: dataManagerExisting.find('status', 'Inactive') || [],
      route: Route,
    });
  }

  public async setRequested(req: Request, res: Response): Promise<void> {
    const id: string = req.query.id as string;

    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
    dataManagerExisting.set(req.session.existingmanager?.data || []);

    if (dataManagerExisting.get(id)?.value.status === Status.INACTIVE) {
      dataManagerExisting.setStatus(id, Status.REQUESTED);
      req.session.existingmanager = dataManagerExisting;
    }

    res.redirect(Route.REVIEW);
  }

  public async setInactive(req: Request, res: Response): Promise<void> {
    const id: string = req.query.id as string;

    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
    dataManagerExisting.set(req.session.existingmanager?.data || []);

    if (dataManagerExisting.get(id)?.value.status === Status.REQUESTED) {
      dataManagerExisting.setStatus(id, Status.INACTIVE);
      req.session.existingmanager = dataManagerExisting;
    }

    res.redirect(Route.REVIEW);
  }
}
