import { Route } from './../constants';
import { DataNotFoundError, MasterNotFoundError } from './../errors';
import {
  DataManagerDataObject,
  ExistingFlagProcessorInterface,
  FlagProcessorInterface,
  Logger,
  RedisClientInterface,
  ReferenceData,
  ServiceAuth,
  ServiceConfigFlagInterface,
} from './../interfaces';
import { ExistingFlagsManager, NewFlagsManager } from './../managers';
import { InboundPayloadStore } from './../models';
import { languages } from './../modules/translation';
import { flagResourceType } from './../services';
import { DataTimeUtilities, ServiceConfig, UrlRoute } from './../utilities';

import autobind from 'autobind-decorator';
import { plainToClass } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';

@autobind
export class DataController {
  constructor(
    private logger: Logger,
    private redisClient: RedisClientInterface,
    private refdata: ReferenceData,
    private flagProcessor: FlagProcessorInterface,
    private existingFlagProcessor: ExistingFlagProcessorInterface,
    private serviceAuth: ServiceAuth
  ) {}

  public async process(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    if (req.session.history) {
      req.session.history.length = 0;
    }
    try {
      const id: string = req.params.id.toString();
      //Check the key exists
      if (!(await this.redisClient.exists(id))) {
        throw new DataNotFoundError(`Data with ID ${id} not found`);
      }

      //Get data from redis store
      const data: string | null = await this.redisClient.get(id);

      if (!data) {
        throw new DataNotFoundError(`Data with ID ${id} not found`);
      }

      const payloadStore: InboundPayloadStore = plainToClass(
        InboundPayloadStore,
        JSON.parse(data) as InboundPayloadStore
      );

      const serviceId = payloadStore.payload.hmctsServiceId;
      this.logger.info(`Invoked by HMCTS service with id: ${serviceId}`);

      // Store the exisitng flags manages in session data
      req.session.partyname = payloadStore.payload.existingFlags.partyName;
      req.session.roleoncase = payloadStore.payload.existingFlags.roleOnCase;
      req.session.callbackUrl = payloadStore.payload.callbackUrl;
      this.logger.info(`${serviceId} provided callback URL : "${payloadStore.payload.callbackUrl}"`);
      req.session.logoutUrl = payloadStore.payload.logoutUrl;
      if (payloadStore.payload.masterFlagCode) {
        req.session.masterflagcode = payloadStore.payload.masterFlagCode.toUpperCase();
      } else {
        req.session.masterflagcode = 'RA0001';
      }
      req.session.hmctsserviceid = serviceId;
      req.session.welsh = payloadStore.payload.language === languages.Cy;
      req.session.correlationId = payloadStore.payload.correlationId;

      //Populate the existing manager
      req.session.existingmanager = new ExistingFlagsManager();
      if (payloadStore.payload.existingFlags.details) {
        req.session.existingmanager.set(this.existingFlagProcessor.process(payloadStore.payload.existingFlags.details));
      }

      const serviceToken = await this.serviceAuth.getToken();

      // Get Reference data - Always use true for welsh.
      const refdata = await this.refdata.getFlags(
        serviceToken,
        payloadStore.idamToken,
        payloadStore.payload.hmctsServiceId,
        flagResourceType.PARTY,
        true
      );

      //Process the refdata
      const processedData: DataManagerDataObject[] = this.flagProcessor.processAll(
        DataTimeUtilities.getDateTime(),
        refdata,
        req.session.welsh
      );

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

      const master: DataManagerDataObject | null = req.session.newmanager.setMaster(req.session.masterflagcode);
      if (!master) {
        throw new MasterNotFoundError(`Master flag with code ${req.session.masterflagcode} not found`);
      }
      req.session.mastername = master.value.name;
      req.session.mastername_cy = master.value.name_cy;

      req.session.sessioninit = true;

      //remove data from redis
      this.redisClient.delete(id);

      //Redirect to the correct location
      if (req.session.existingmanager.data.length === 0) {
        //No Payload found redirect to new flags setup
        return res
          .status(301)
          .redirect(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: master.id }, UrlRoute.url(req)));
      } else {
        //Existing flags found redirect to existing flags
        return res.status(301).redirect(UrlRoute.make(Route.OVERVIEW, {}, UrlRoute.url(req)));
      }
    } catch (e) {
      this.logger.error(e.message);
      next(e);
    }
  }
}
