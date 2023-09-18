import { DataManagerDataObject, RedisClientInterface } from '../interfaces';

import { PayloadBuilder } from './../builders';
import { ErrorMessages, Route, Status } from './../constants';
import { OutboundPayload } from './../models';
import { UrlRoute } from './../utilities';

import autobind from 'autobind-decorator';
import { Request, Response } from 'express';

@autobind
export class ReviewController {
  constructor(private redisClient: RedisClientInterface) {}

  public async get(req: Request, res: Response): Promise<void> {
    if (req.session.callbackUrl) {
      const url = UrlRoute.make(req.session.callbackUrl, { id: '' });
      res.set('Content-Security-Policy', `form-action 'self' ${url}`);
    }
    res.render('review', {
      welsh: false,
      requested: req.session.existingmanager?.find('value.status', 'Requested'),
      new: req.session.newmanager
        ?.find('_enabled', true)
        ?.filter((item: DataManagerDataObject) => item._isParent === false),
      notRequired: req.session.existingmanager?.find('value.status', 'Inactive') || [],
      route: Route,
    });
  }

  public async setRequested(req: Request, res: Response): Promise<void> {
    const id: string = req.query.id as string;

    if (req.session.existingmanager?.get(id)?.value.status === Status.INACTIVE) {
      req.session.existingmanager?.setStatus(id, Status.REQUESTED);
    }

    res.redirect(Route.REVIEW);
  }

  public async setInactive(req: Request, res: Response): Promise<void> {
    const id: string = req.query.id as string;

    if (req.session.existingmanager?.get(id)?.value.status === Status.REQUESTED) {
      req.session.existingmanager?.setStatus(id, Status.INACTIVE);
    }

    res.redirect(Route.REVIEW);
  }

  public async post(req: Request, res: Response): Promise<Response | void> {
    if (!req.session || !req.session.callbackUrl) {
      throw ErrorMessages.UNEXPECTED_ERROR;
    }
    const payload: OutboundPayload = PayloadBuilder.build(req);

    //gen id
    const uuid = await this.redisClient.generateUUID();

    //Save data to redis store
    await this.redisClient.set(uuid, JSON.stringify(payload));

    //Create Url from callback to service to redirect the user
    const url = UrlRoute.make(req.session.callbackUrl, { id: uuid });

    req.session.destroy(function () {});
    res.set('Content-Security-Policy', `form-action 'self' ${url}`);

    //redirect back to invoking service with unique id
    return res.status(301).redirect(url);
  }
}
