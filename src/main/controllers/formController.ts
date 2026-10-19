import { DataManagerDataObject } from '../interfaces';

import { HTTPError } from './../HttpError';
import { FormBuilder } from './../builders';
import { ErrorMessages, Route } from './../constants';
import { Form } from './../models';
import { FormProcessor } from './../processors';
import { UrlRoute } from './../utilities';
import { FormValidator } from './../validators';

import autobind from 'autobind-decorator';
import { plainToInstance } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';

type QueryParams = Record<string, string | number | boolean>;

@autobind
export class FormController {
  public display(req: Request, res: Response, next: NextFunction): void | Response {
    try {
      const id = req.params.id;
      const change = req.query?.change !== undefined;

      //Get flag
      const flag = req.session.newmanager?.get(id);

      if (!flag) {
        //throw error
        throw new HTTPError(ErrorMessages.UNEXPECTED_ERROR, 404);
      }

      if (change) {
        res.locals.change = true;
      }

      return FormBuilder.build(req, res, flag, req.session.newmanager?.getChildren(id));
    } catch (e) {
      return next(e);
    }
  }

  public async post(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const id = req.params.id;
      const change = req.query?.change !== undefined;
      const newQuery = req.query?.new !== undefined;

      //Get flag
      const flag = req.session.newmanager?.get(id);

      if (!flag) {
        //throw error because we cant find the id
        throw new HTTPError(ErrorMessages.UNEXPECTED_ERROR, 404);
      }

      const formModel = plainToInstance(Form, req.body);

      //validate form body
      const [bodyValid, bodyErrors] = await FormValidator.validateBody(flag, formModel);

      if (!bodyValid) {
        this.saveTempFormData(req, id, formModel, flag);
        return FormBuilder.build(req, res, flag, req.session.newmanager?.getChildren(id), bodyErrors);
      }

      //check if no support has been selected
      if (!formModel.enabled.includes('none') && formModel.selected !== 'none') {
        const { formData, validationErrors, parent, children } = await this.processAndValidate(
          req,
          id,
          formModel,
          flag
        );

        if (Object.keys(validationErrors).length > 0) {
          return FormBuilder.build(req, res, parent, children, validationErrors);
        }

        //only save back once all validation has passed
        req.session.newmanager?.save(formData);
      } else {
        //no support required disable flags
        req.session.newmanager?.disable(id);
      }

      return this.redirectAfterPost(req, res, id, change, newQuery);
    } catch (e) {
      return next(e);
    }
  }

  private async processAndValidate(req: Request, id: string, formModel: Form, flag: DataManagerDataObject) {
    const formData = FormProcessor.process(formModel, flag, req.session.newmanager?.getChildren(id));
    //validate the new filtered data here
    const [validationErrors, parent, children] = await FormValidator.validate(formData, flag);
    return { formData, validationErrors, parent, children };
  }

  private saveTempFormData(req: Request, id: string, formModel: Form, flag: DataManagerDataObject): void {
    const tempManager = req.session.newmanager;

    /* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
    try {
      //temp merge data for error
      const formData: DataManagerDataObject[] = FormProcessor.process(formModel, flag, tempManager?.getChildren(id));
      tempManager?.save(formData);
    } catch (e) {}
  }

  private redirectAfterPost(
    req: Request,
    res: Response,
    id: string,
    change: boolean,
    newQuery: boolean
  ): Response | void {
    //process the form and produce the data used to validate and save
    const nextPage = req.session.newmanager?.getNext(id);
    const queryParams: QueryParams = {};

    if (change) {
      res.locals.change = 'true';
      Object.assign(queryParams, { change: true });
      const hasUnaswered = req.session.newmanager?.hasUnaswered();
      if (!hasUnaswered && !newQuery) {
        return res.redirect(Route.REVIEW);
      }
    }

    if (newQuery) {
      Object.assign(queryParams, { new: true });
    }

    const queryString = this.buildQueryString(queryParams);
    //check where to redirect the user. next page for new journey or back to the review page

    if (!nextPage) {
      //go to summary page as there are no more steps
      return res.redirect(Route.REVIEW);
    }

    return res.redirect(
      `${UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: nextPage.id }, UrlRoute.url(req))}${queryString}`
    );
  }

  private buildQueryString(queryParams: QueryParams): string {
    if (Object.keys(queryParams).length === 0) {
      return '';
    }
    return (
      '?' +
      Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&')
    );
  }
}
