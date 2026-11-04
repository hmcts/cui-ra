import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';
import { localServiceMappings } from '../../../config/localServiceMappings';
import { IdamTokenService } from '../services/idamToken';
import {
  DataManagerDataObject,
  FlagProcessorInterface,
  ReferenceData,
  ServiceAuth,
  ServiceConfigFlagInterface,
} from './../interfaces';
import { flagResourceType } from './../services';
import { NewFlagsManager } from '../managers';
import { DataTimeUtilities, ServiceConfig, UrlRoute } from './../utilities';
import { MasterNotFoundError } from '../errors';
import { Route } from '../constants';

@autobind
export class InvokerController {
  constructor(
    private readonly refdata: ReferenceData,
    private readonly flagProcessor: FlagProcessorInterface,
    private readonly serviceAuth: ServiceAuth,
  ) {}

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Add code here to populate payloads/session for demo purposes.
    try {
      // these shouldn't be static - setting for now
      // serviceid is currently fetched from the frontend in startInvoker - do I need to fetch it here?
      req.session.hmctsserviceid = 'XXXX'; // fetch when service is selected
      req.session.history = [];
      req.session.masterflagcode = 'RA0001';
      req.session.mastername = 'Reasonable adjustment'; // welsh translation, language interpreter
      req.session.mastername_cy = 'Addasiad rhesymol';
      req.session.partyname = 'john doe';

      res.render('invoker');
    } catch (e) {
      next(e);
    }
  }

  public async startInvoker(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // fetch service id based on service selected
      const service = req.query.journey;

      console.log(`Service selected: ${service}`);

      const mapping = service ? localServiceMappings[service.toString()] : undefined;

      if (!mapping) {
        console.log(`No mapping found for service: ${service}`);
        return;
      }

      const serviceId = mapping[0];

      console.log(service, serviceId);

      // fetch case flags using service id
      // manual check for onboarded services - add services or replace logic later
      if (serviceId == 'ABA5' || serviceId == 'BHA1' || serviceId == 'AAA3') {
        console.log('Service onboarded. Fetching case flags...');
        req.session.hmctsserviceid = serviceId;
        req.session.welsh = false;
        req.session.history = [];

        // missing option for existing journey

        const serviceToken = await this.serviceAuth.getToken();

        const idamToken = await new IdamTokenService().generateIdamToken();
        if (idamToken) {
          console.log('IDAM token generated successfully');
        }

        const refdata = await this.refdata.getFlags(serviceToken, idamToken, serviceId, flagResourceType.PARTY, true);

        if (refdata) {
          console.log('case flags found');
          // console.log(`Case Flags: ${JSON.stringify(refdata)}`);

          const processedData: DataManagerDataObject[] = this.flagProcessor.processAll(
            DataTimeUtilities.getDateTime(),
            refdata,
            req.session.welsh
          );

          req.session.newmanager = new NewFlagsManager();
          req.session.newmanager.set(processedData);

          // console.log(`Processed Data: ${JSON.stringify(processedData)}`);

          req.session.newmanager = new NewFlagsManager();
          req.session.newmanager.set(processedData);

          const config = new ServiceConfig(req.session.hmctsserviceid);
          //remove flags before processing
          const flagsToRemove: string[] = config
            .getFlags()
            .filter((item: ServiceConfigFlagInterface) => item.remove === true)
            .map(item => item.flagCode);
          //newFlagsManager remove items based on flagcodes
          req.session.newmanager.deleteFlagCodeByDotKeyList(flagsToRemove);

          // using default master flag code - may need to be changed down the line
          req.session.masterflagcode = 'RA0001';
          const master: DataManagerDataObject | null = req.session.newmanager.setMaster(req.session.masterflagcode);
          if (!master) {
            throw new MasterNotFoundError(`Master flag with code ${req.session.masterflagcode} not found`);
          }
          req.session.mastername = master.value.name;
          req.session.mastername_cy = master.value.name_cy;

          req.session.sessioninit = true;


          return res
            .status(301)
            .redirect(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: master.id }, UrlRoute.url(req)));

        } else {
          console.log('No case flags found');
        }
      } else {
        console.log('Service not yet onboarded.');
      }

      return res.render('invoker');
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

  /*private setSessionData(
    req: Request,
    host: string,
    newManager: NewFlagsManager,
    hmctsServiceId: string,
    welsh: boolean,
    existingManager: ExistingFlagsManager = new ExistingFlagsManager()
  ): void {}*/
}
