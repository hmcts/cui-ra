import { DataManagerDataObject } from '../interfaces';

import { FormBuilder } from './../builders';
import { ErrorMessages, Route } from './../constants';
import { Form } from './../models';
import { FormProcessor } from './../processors';
import { UrlRoute } from './../utilities';

import autobind from 'autobind-decorator';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';

@autobind
export class FormController {
  public async display(req: Request, res: Response): Promise<void | Response> {
    const id = req.params.id;

    //Get flag
    const flag = req.session.newmanager?.get(id);

    if (!flag) {
      //throw error
      throw new Error(ErrorMessages.UNEXPECTED_ERROR);
    }

    return FormBuilder.build(res, flag, req.session.newmanager?.getChildren(id));
  }

  public async post(req: Request, res: Response): Promise<Response | void> {
    const id = req.params.id;

    //Get flag
    const flag = req.session.newmanager?.get(id);

    if (!flag) {
      //throw error because we cant find the id
      throw new Error(ErrorMessages.UNEXPECTED_ERROR);
    }

    const formModel = plainToClass(Form, req.body);

    //process the form and produce the data used to validate and save
    const formData: DataManagerDataObject[] = FormProcessor.process(
      formModel,
      flag,
      req.session.newmanager?.getChildren(id)
    );

    const validationErrors: string[] = [];

    //validate the new filtered data here

    //create a custom validor here

    //set errors if errors occure

    //rerender the screen with errors
    if (validationErrors.length > 0) {
      return FormBuilder.build(res, flag, req.session.newmanager?.getChildren(id), validationErrors);
    }

    //only save back once all validation has passed
    req.session.newmanager?.save(formData);

    const next = req.session.newmanager?.getNext(id);

    if (!next) {
      //go to summary page as there are no more steps
      return res.redirect(Route.OVERVIEW);
    }

    return res.redirect(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: next.id }, UrlRoute.url(req)));
  }
}
