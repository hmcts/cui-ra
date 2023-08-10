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
import { flagResourceType } from './../services';
import { DataTimeUtilities, UrlRoute } from './../utilities';

import autobind from 'autobind-decorator';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';

@autobind
export class DataController {
  constructor(
    private logger: Logger,
    private redisClient: RedisClientInterface,
    private refdata: ReferenceData,
    private flagProcessor: FlagProcessorInterface,
    private serviceAuth: ServiceAuth
  ) {}

  public async process(req: Request, res: Response): Promise<Response | void> {
    const id: string = req.params.id.toString();
    try {
      //Check the key exists
      if (!(await this.redisClient.exists(id))) {
        return res.status(404).send(ErrorMessages.DATA_NOT_FOUND);
      }

      //Get data from redis store
      const data: string | null = await this.redisClient.get(id);

      if (!data) {
        return res.status(404).send(ErrorMessages.DATA_NOT_FOUND);
      }

      const payloadStore: InboundPayloadStore = plainToClass(
        InboundPayloadStore,
        JSON.parse(data) as InboundPayloadStore
      );

      //Store the exisitng flags manages in session data
      req.session.partyname = payloadStore.payload.existingFlags.partyName;
      req.session.roleoncase = payloadStore.payload.existingFlags.roleOnCase;
      req.session.callbackUrl = payloadStore.payload.callbackUrl;
      req.session.logoutUrl = payloadStore.payload.logoutUrl;
      req.session.masterflagcode = payloadStore.payload.masterFlagCode || 'RA0001';
      req.session.hmctsserviceid = payloadStore.payload.hmctsServiceId;
      //Populate the existing manager
      req.session.existingmanager = new ExistingFlagsManager();
      req.session.existingmanager.set(payloadStore.payload.existingFlags.details);

      const serviceToken = await this.serviceAuth.getToken();

      //Get Reference data - Always use true for welsh.
      const refdata = await this.refdata.getFlags(
        serviceToken,
        payloadStore.idamToken,
        payloadStore.payload.hmctsServiceId,
        flagResourceType.CASE,
        true
      );

      //Process the refdata
      const processedData: DataManagerDataObject[] = this.flagProcessor.process(
        DataTimeUtilities.getDateTime(),
        refdata
      );

      req.session.newmanager = new NewFlagsManager();
      req.session.newmanager.set(processedData);

      const master:DataManagerDataObject[] = req.session.newmanager.find('flagCode',payloadStore.payload.masterFlagCode);
      if(master.length > 0){
        req.session.mastername = master[0].value.name;
        req.session.mastername_cy = master[0].value.name_cy;
      }

      //Redirect to the correct location
      if (req.session.existingmanager.data.length === 0) {
        //No Payload found redirect to new flags setup
        return res.status(301).redirect(UrlRoute.make(Route.JOURNEY_NEW_FLAGS, {}, UrlRoute.url(req)));
      } else {
        //Exisitng flags found redirect to exisiting flags
        return res.status(301).redirect(UrlRoute.make(Route.JOURNEY_EXSITING_FLAGS, {}, UrlRoute.url(req)));
      }
    } catch (e) {
      this.logger.error(e.message);
      return res.status(500).send(ErrorMessages.UNEXPECTED_ERROR);
    }
  }
}
