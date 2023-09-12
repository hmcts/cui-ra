import { ErrorMessages, HeaderParams, Route } from './../constants';
import { Logger, RedisClientInterface } from './../interfaces';
import { InboundPayload, InboundPayloadStore } from './../models';
import { UrlRoute } from './../utilities';

import autobind from 'autobind-decorator';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';

@autobind
export class ApiController {
  constructor(private logger: Logger, private redisClient: RedisClientInterface) {}

  public async postPayload(req: Request, res: Response): Promise<Response> {
    try {
      const idamToken = req.headers[HeaderParams.IDAM_TOKEN];
      const serviceToken = req.headers[HeaderParams.SERVICE_TOKEN];

      if (!idamToken || !serviceToken) {
        return res.status(401).json({ error: ErrorMessages.TOKENS_NOT_FOUND });
      }

      if (typeof idamToken !== 'string' || typeof serviceToken !== 'string') {
        return res.status(401).json({ error: ErrorMessages.TOKENS_INCORRECT_FORMAT });
      }

      //Bind posted data to class
      const payload: InboundPayload = plainToClass(InboundPayload, req.body);

      //save data
      const payloadStore = new InboundPayloadStore(idamToken, serviceToken, payload);

      const uuid = await this.redisClient.generateUUID();

      //Save data to redis store
      await this.redisClient.set(uuid, JSON.stringify(payloadStore));

      //Create Url endpoint for the service to redirect the user
      const url = UrlRoute.make(Route.DATA_PROCESS, { id: uuid }, UrlRoute.url(req));
      return res.status(201).json({
        url,
      });
    } catch (e) {
      this.logger.error(e.message);
      return res.status(500).json({ error: ErrorMessages.UNEXPECTED_ERROR });
    }
  }

  public async getPayload(req: Request, res: Response): Promise<Response> {
    const id: string = req.params.id;
    try {
      //Check the key exists
      if (!(await this.redisClient.exists(id))) {
        res.status(404).json({ error: ErrorMessages.DATA_NOT_FOUND });
      }

      //Get data from redis store
      let data = await this.redisClient.get(id);

      if (!data) {
        return res.status(404).json({ error: ErrorMessages.DATA_NOT_FOUND });
      }

      if (data) {
        data = JSON.parse(data);
      }

      return res.status(200).json(data);
    } catch (e) {
      this.logger.error(e.message);
      return res.status(500).json({ error: ErrorMessages.UNEXPECTED_ERROR });
    }
  }
}
