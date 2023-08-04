import fs from 'fs';
import autobind from 'autobind-decorator';
import { Request, Response } from 'express';
import {
  DataManagerDataObject,
  PayloadCollectionItem,
} from './../interfaces';
import { ExistingFlagsManager, NewFlagsManager } from './../managers';
import { FlagProcessor } from './../processors';
import { DataTimeUtilities } from './../utilities';

@autobind
export class HomeController {
  public async get(req: Request, res: Response): Promise<void> {
    res.render('home');
  }

  public async overview(req: Request, res: Response): Promise<void> {
    res.render('overview');
  }

  public async intro(req: Request, res: Response): Promise<void> {
    res.render('intro');
  }

  public async review(req: Request, res: Response): Promise<void> {
    // Hard code data for review page
    req.session.partyname = "Hard coded party name rendered from controller";

    // EXISTING
    const existingJson: PayloadCollectionItem[] = 
      JSON.parse(fs.readFileSync(__dirname + '/../../test/unit/data/flags-payload.json', 'utf-8'));

    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
    dataManagerExisting.set(existingJson);

    /*     
      req.session.exisitingmanager = JSON.stringify(
      new ExistingFlagsManager().set(payloadStore.payload.existingFlags.details)
    ); 
    */

    // NEW
    const newJson = 
      JSON.parse(fs.readFileSync(__dirname + '/../../test/unit/data/flags.json', 'utf-8'));

    const flagProcessor = new FlagProcessor();

   // Process the refdata
    const processedData: DataManagerDataObject[] = flagProcessor.process(
      DataTimeUtilities.getDateTime(),
      newJson.flags[0].FlagDetails
    );

    const dataManagerNew: NewFlagsManager = new NewFlagsManager();
    dataManagerNew.set(processedData);

    /*     
    req.session.newmanager = JSON.stringify(
      new ExistingFlagsManager().set(payloadStore.payload.existingFlags.details)
    );  
    */

    res.render('review', {
      partyname: req.session.partyname,
      requested: dataManagerExisting.find("status", "Requested").splice(16),
      //new: dataManagerNew.find("_enabled", "true"),
      new: dataManagerNew.find("status", "Requested").splice(18),
      notRequired: dataManagerExisting.find("status", "Inactive"),
    });
  }
}
