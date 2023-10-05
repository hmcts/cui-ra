import { HTTPError } from './../HttpError';
import { ErrorMessages, Route } from './../constants';
import {
  DataManagerDataObject,
  FlagProcessorInterface,
  Logger,
  RedisClientInterface,
  ReferenceData,
  ServiceAuth,
} from './../interfaces';
import { ExistingFlagsManager, NewFlagsManager } from './../managers';
import { InboundPayloadStore } from './../models';
import { languages } from './../modules/translation';
import { flagResourceType } from './../services';
import { DataTimeUtilities, UrlRoute } from './../utilities';

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
    private serviceAuth: ServiceAuth
  ) {}

  public async process(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const id: string = req.params.id.toString();
      //Check the key exists
      if (!(await this.redisClient.exists(id))) {
        throw new HTTPError(ErrorMessages.DATA_NOT_FOUND, 404);
      }

      //Get data from redis store
      const data: string | null = await this.redisClient.get(id);

      if (!data) {
        throw new HTTPError(ErrorMessages.DATA_NOT_FOUND, 404);
      }

      const payloadStore: InboundPayloadStore = plainToClass(
        InboundPayloadStore,
        JSON.parse(data) as InboundPayloadStore
      );

      // Store the exisitng flags manages in session data
      req.session.partyname = payloadStore.payload.existingFlags.partyName;
      req.session.roleoncase = payloadStore.payload.existingFlags.roleOnCase;
      req.session.callbackUrl = payloadStore.payload.callbackUrl;
      req.session.logoutUrl = payloadStore.payload.logoutUrl;
      req.session.masterflagcode = payloadStore.payload.masterFlagCode || 'RA0001';
      req.session.hmctsserviceid = payloadStore.payload.hmctsServiceId;
      req.session.welsh = payloadStore.payload.language === languages.Cy;
      req.session.correlationId = payloadStore.payload.correlationId;

      //Populate the existing manager
      req.session.existingmanager = new ExistingFlagsManager();
      req.session.existingmanager.set(payloadStore.payload.existingFlags.details);

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

      const master: DataManagerDataObject[] = req.session.newmanager.find('value.flagCode', req.session.masterflagcode);
      if (master.length > 0) {
        req.session.mastername = master[0].value.name;
        req.session.mastername_cy = master[0].value.name_cy;
        req.session.newmanager?.enable(master[0].id, false);
      }

      req.session.sessioninit = true;

      //remove data from redis
      this.redisClient.delete(id);

      //Redirect to the correct location
      if (!req.session.existingmanager.data) {
        //No Payload found redirect to new flags setup
        return res
          .status(301)
          .redirect(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: master[0].id }, UrlRoute.url(req)));
      } else {
        //Exisitng flags found redirect to exisiting flags
        return res.status(301).redirect(UrlRoute.make(Route.OVERVIEW, {}, UrlRoute.url(req)));
      }
    } catch (e) {
      this.logger.error(e.message);
      if (!(e instanceof HTTPError)) {
        next(new HTTPError(ErrorMessages.UNEXPECTED_ERROR, 500));
      }
      next(e);
    }
  }
}
