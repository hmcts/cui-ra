import fs from 'fs';

import { DataManagerDataObject, PayloadCollectionItem } from './../interfaces';
import { ExistingFlagsManager, NewFlagsManager } from './../managers';
import { FlagProcessor } from './../processors';
import { DataTimeUtilities } from './../utilities';

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
      partyName: req.session.partyname,
      existingFlags: req.session.existingmanager?.data,
    });
  }

  public async intro(req: Request, res: Response): Promise<void> {
    res.render('intro');
  }

  public async review(req: Request, res: Response): Promise<void> {
    // Existing flags
    const existingJson: PayloadCollectionItem[] = JSON.parse(
      fs.readFileSync(__dirname + '/../../test/unit/data/flags-payload.json', 'utf-8')
    );

    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
    dataManagerExisting.set(existingJson);

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
      requested: dataManagerExisting.find('status', 'Requested').splice(16),
      //new: dataManagerNew.find("_enabled", "true"),
      new: dataManagerNew.find('status', 'Requested').splice(18), // To be replaced with _enabled once work has been completed
      notRequired: dataManagerExisting.find('status', 'Inactive'),
    });
  }
}
