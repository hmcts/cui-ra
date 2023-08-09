import fs from 'fs';

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
        const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager() ;
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
        });
    }

    public async addRequest(req: Request, res: Response): Promise<void> {
        //const id = req.params.id;
        
/* 
        const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager() ;
        dataManagerExisting.set(req.session.existingmanager?.data || []);

        dataManagerExisting.find(item => item.id !== id);
        req.session.existingmanager = req.session.existingmanager?.filter(item => item.id !== id); 
*/

        res.redirect('review');
    }

    public async removeRequest(req: Request, res: Response): Promise<void> {
        //const id = req.params.id;

/* 
        const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager() ;
        dataManagerExisting.set(req.session.existingmanager?.data || []);

        dataManagerExisting.find(item => item.id !== id);
        req.session.existingmanager = req.session.existingmanager?.filter(item => item.id !== id); 
*/

        res.redirect('review');
    }
}