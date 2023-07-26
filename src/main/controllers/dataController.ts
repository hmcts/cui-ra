import { ErrorMessages, Route } from './../constants';
import { DataManagerDataObject, FlagProcessorInterface, RedisClientInterface, ReferenceData } from './../interfaces';
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
    private redisClient: RedisClientInterface,
    private refdata: ReferenceData,
    private flagProcessor: FlagProcessorInterface
  ) {}

  public async process(req: Request, res: Response): Promise<Response | void> {
    const id: string = req.params.id;
    try {
      //Check the key exists
      if (!(await this.redisClient.exists(id))) {
        throw Error(ErrorMessages.DATA_NOT_FOUND);
      }

      //Get data from redis store
      const data: string | null = await this.redisClient.get(id);

      if (!data) {
        throw Error(ErrorMessages.DATA_NOT_FOUND);
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
      req.session.exisitingmanager = JSON.stringify(
        new ExistingFlagsManager().set(payloadStore.payload.existingFlags.details)
      );

      //Get Reference data - Always use true for welsh.
      const refdata = await this.refdata.getFlags(
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

      req.session.newmanager = JSON.stringify(new NewFlagsManager().set(processedData));

      //Redirect to the correct location
      if (payloadStore.payload.existingFlags.details.length === 0) {
        //No Payload found redirect to new flags setup
        return res.status(301).redirect(UrlRoute.make(Route.DATA_PROCESS, {}, UrlRoute.url(req)));
      } else {
        //Exisitng flags found redirect to exisiting flags
        return res.status(301).redirect(UrlRoute.make(Route.DATA_PROCESS, {}, UrlRoute.url(req)));
      }
    } catch (e) {
      return res.status(500).send(e.message);
    }
  }
}
