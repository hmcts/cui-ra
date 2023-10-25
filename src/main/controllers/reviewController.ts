import { DataManagerDataObject, PayloadDataObject, RedisClientInterface } from '../interfaces';

import { HTTPError } from './../HttpError';
import { PayloadBuilder } from './../builders';
import { Actions, ErrorMessages, Route, Status } from './../constants';
import { OutboundPayload } from './../models';
import { CustomSort, UrlRoute } from './../utilities';

import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';

@autobind
export class ReviewController {
  constructor(private redisClient: RedisClientInterface) {}

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.session.callbackUrl) {
        const url = UrlRoute.make(req.session.callbackUrl, { id: '' });
        res.set('Content-Security-Policy', `form-action 'self' ${url}`);
      }

      let requestedFlags = req.session.existingmanager?.find('value.status', 'Requested');
      if (requestedFlags) {
        requestedFlags = requestedFlags.filter(item => item._editable === true);
        requestedFlags = CustomSort.alphabeticalAsc<PayloadDataObject>(requestedFlags, req);
      }

      let newFlags = req.session.newmanager
        ?.find('_enabled', true)
        ?.filter((item: DataManagerDataObject) => item._isParent === false);
      if (newFlags) {
        newFlags = CustomSort.alphabeticalAsc<DataManagerDataObject>(newFlags, req);
      }

      let notRequiredFlags = req.session.existingmanager?.find('value.status', 'Inactive');
      if (notRequiredFlags) {
        notRequiredFlags = notRequiredFlags.filter(item => item._editable === true);
        notRequiredFlags = CustomSort.alphabeticalAsc<PayloadDataObject>(notRequiredFlags, req);
      }

      let masterId;
      const ids = req.session.newmanager?.findIdsByFlagCodeDotNotation(req.session.masterflagcode) ?? [];
      if (ids.length > 0) {
        masterId = ids[0];
      }

      res.render('review', {
        masterId: masterId ?? '',
        welsh: req.session.welsh,
        requested: requestedFlags,
        new: newFlags,
        notRequired: notRequiredFlags,
      });
    } catch (e) {
      next(e);
    }
  }

  public async setRequested(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.query.id as string;

      const item = req.session.existingmanager?.get(id);

      if (!item?._editable) {
        throw new HTTPError(ErrorMessages.FLAG_CANNOT_BE_EDITED, 403);
      }

      if (item?.value.status === Status.INACTIVE) {
        req.session.existingmanager?.setStatus(id, Status.REQUESTED);
      }

      res.redirect(Route.REVIEW);
    } catch (e) {
      next(e);
    }
  }

  public async setInactive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id: string = req.query.id as string;

      const item = req.session.existingmanager?.get(id);

      if (!item) {
        throw new HTTPError(ErrorMessages.DATA_NOT_FOUND, 404);
      }

      if (!item._editable) {
        throw new HTTPError(ErrorMessages.FLAG_CANNOT_BE_EDITED, 403);
      }

      if (item.value.status === Status.REQUESTED) {
        req.session.existingmanager?.setStatus(id, Status.INACTIVE);
      }

      res.redirect(Route.REVIEW);
    } catch (e) {
      next(e);
    }
  }

  public async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const change = !!(req.query && typeof req.query.change !== 'undefined');

      if (!req.session || !req.session.callbackUrl) {
        throw new Error(ErrorMessages.UNEXPECTED_ERROR);
      }

      if (change) {
        return res.redirect(Route.REVIEW);
      }

      const payload: OutboundPayload = PayloadBuilder.build(req, Actions.CANCEL);

      //gen id
      const uuid = await this.redisClient.generateUUID();

      //Save data to redis store
      await this.redisClient.set(uuid, JSON.stringify(payload));

      //Create Url from callback to service to redirect the user
      const url = UrlRoute.make(req.session.callbackUrl, { id: uuid });

      req.session.destroy(function () {});

      //redirect back to invoking service with unique id
      res.redirect(302, url);
    } catch (e) {
      next(e);
    }
  }

  public async post(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
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
    } catch (e) {
      next(e);
    }
  }
}
