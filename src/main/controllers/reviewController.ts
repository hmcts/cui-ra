import { HTTPError } from '../HttpError';
import { PayloadBuilder } from '../builders';
import { Actions, ErrorMessages, Route, Status } from '../constants';
import { DataManagerDataObject, Logger, PayloadDataObject, RedisClientInterface } from '../interfaces';
import { OutboundPayload } from '../models';
import { CustomSort, UrlRoute } from '../utilities';

import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';

@autobind
export class ReviewController {
  constructor(
    private logger: Logger,
    private redisClient: RedisClientInterface
  ) {}

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.session.callbackUrl) {
        try {
          if (!UrlRoute.isCallbackUrlWhitelisted(req.session.callbackUrl)) {
            throw new HTTPError(ErrorMessages.INVALID_CALLBACK_URL, 400);
          }
          this.logger.info(`Callback URL @review: ${req.session.callbackUrl}`);
          const url = new URL(UrlRoute.make(req.session.callbackUrl, { id: '' }));
          res.set('Content-Security-Policy', `form-action 'self' ${url}`);
        } catch (err) {
          if (err instanceof HTTPError) {
            throw err;
          }
          const message = err instanceof Error ? err.message : String(err);
          throw new Error(ErrorMessages.UNEXPECTED_ERROR + message);
        }
      }

      const requestedFlags = req.session.existingmanager?.find('value.status', 'Requested') ?? [];
      const activeFlags = req.session.existingmanager?.find('value.status', 'Active') ?? [];
      let editableFlags = requestedFlags.concat(activeFlags).filter(item => item._editable);
      editableFlags = CustomSort.alphabeticalAsc<PayloadDataObject>(editableFlags, req);

      let newFlags = req.session.newmanager
        ?.find('_enabled', true)
        ?.filter((item: DataManagerDataObject) => !item._isParent);
      if (newFlags) {
        newFlags = CustomSort.alphabeticalAsc<DataManagerDataObject>(newFlags, req);
      }

      let notRequiredFlags = req.session.existingmanager?.find('value.status', 'Inactive');
      if (notRequiredFlags) {
        notRequiredFlags = notRequiredFlags.filter(item => item._editable);
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
        requested: editableFlags,
        new: newFlags,
        notRequired: notRequiredFlags,
      });
    } catch (e) {
      this.logger.error(e.message);
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
      this.logger.error(e.message);
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

      if (item.value.status === Status.REQUESTED || item.value.status === Status.ACTIVE) {
        req.session.existingmanager?.setStatus(id, Status.INACTIVE);
      }

      res.redirect(Route.REVIEW);
    } catch (e) {
      this.logger.error(e.message);
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

      if (!UrlRoute.isCallbackUrlWhitelisted(req.session.callbackUrl)) {
        throw new HTTPError(ErrorMessages.INVALID_CALLBACK_URL, 400);
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
      this.logger.error(e.message);
      next(e);
    }
  }

  public async post(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.session || !req.session.callbackUrl) {
        throw new HTTPError(ErrorMessages.UNEXPECTED_ERROR, 500);
      }
      if (!UrlRoute.isCallbackUrlWhitelisted(req.session.callbackUrl)) {
        throw new HTTPError(ErrorMessages.INVALID_CALLBACK_URL, 400);
      }
      const payload: OutboundPayload = PayloadBuilder.build(req);

      //gen id
      const uuid = await this.redisClient.generateUUID();

      //Save data to redis store
      await this.redisClient.set(uuid, JSON.stringify(payload));

      //Create Url from callback to service to redirect the user
      let url;
      try {
        url = new URL(UrlRoute.make(req.session.callbackUrl, { id: uuid }));
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(ErrorMessages.UNEXPECTED_ERROR + message);
      }
      req.session.destroy(function () {});
      res.set('Content-Security-Policy', `form-action 'self' ${url}`);

      //redirect back to invoking service with unique id
      return res.status(301).redirect(url);
    } catch (e) {
      this.logger.error(e.message);
      next(e);
    }
  }
}
