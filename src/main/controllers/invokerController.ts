import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';
import { localServiceMappings } from '../../../config/localServiceMappings';
import {
  DataManagerDataObject,
  FlagProcessorInterface,
  ReferenceData,
  ServiceAuth,
  ServiceConfigFlagInterface,
} from '../interfaces';
import { flagResourceType } from '../services';
import { ExistingFlagsManager, NewFlagsManager } from '../managers';
import { DataTimeUtilities, ServiceConfig, UrlRoute } from '../utilities';
import { MasterNotFoundError } from '../errors';
import { Route } from '../constants';
import { IdamTokenService } from '../services';

@autobind
export class InvokerController {
  constructor(
    private readonly refdata: ReferenceData,
    private readonly flagProcessor: FlagProcessorInterface,
    private readonly serviceAuth: ServiceAuth,
    private readonly idamTokenService: IdamTokenService
  ) {}

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      req.session.history = [];
      req.session.partyname = 'john doe'
      return res.render('invoker', {idamToken: req.session.idamToken ?? '', });
    } catch (e) {
      next(e);
    }
  }

  public async startInvoker(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // constants
      const service = req.query.journey;
      const idamToken = req.session.idamToken?.toString() ?? '';
      const host = 'https://cui-ra.aat.platform.hmcts.net';
      console.log(`Service selected: ${service}`);
      const mapping = service ? localServiceMappings[service.toString()] : undefined;

      if (!mapping) {
        console.log(`No mapping found for service: ${service}`);
        return;
      }

      const serviceId = mapping[0];
      console.log(service, serviceId);

      // fetch case flags using service id. only onboarded services will be reachable.
      if (serviceId == 'ABA5' || serviceId == 'BHA1' || serviceId == 'AAA3') {
        console.log('Service onboarded. Fetching case flags...');
        req.session.hmctsserviceid = serviceId;
        req.session.welsh = false;

        const serviceToken = await this.serviceAuth.getToken();
        const refdata = await this.refdata.getFlags(serviceToken, idamToken, serviceId, flagResourceType.PARTY, true);

        if (refdata) {
          console.log('case flags found');

          const processedData: DataManagerDataObject[] = this.flagProcessor.processAll(
            DataTimeUtilities.getDateTime(),
            refdata,
            req.session.welsh
          );

          req.session.newmanager = new NewFlagsManager();
          req.session.newmanager.set(processedData);
          const config = new ServiceConfig(req.session.hmctsserviceid);
          const flagsToRemove: string[] = config
            .getFlags()
            .filter((item: ServiceConfigFlagInterface) => item.remove === true)
            .map(item => item.flagCode);
          //newFlagsManager remove items based on flagcodes
          req.session.newmanager.deleteFlagCodeByDotKeyList(flagsToRemove);

          req.session.masterflagcode = 'RA0001';
          const master: DataManagerDataObject | null = req.session.newmanager.setMaster(req.session.masterflagcode);
          if (!master) {
            throw new MasterNotFoundError(`Master flag with code ${req.session.masterflagcode} not found`);
          }
          req.session.mastername = master.value.name;
          req.session.mastername_cy = master.value.name_cy;

          req.session.sessioninit = true;

          this.setSessionData(req, host, req.session.newmanager, serviceId, false);

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

  public async generateIdamToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      req.session.idamToken = await this.idamTokenService.generateIdamToken();

      return res.redirect(Route.INVOKER);
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
