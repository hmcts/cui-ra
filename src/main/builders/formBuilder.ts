import { ErrorMessages } from './../constants';
import { DataManagerDataObject } from './../interfaces';
import { CustomSort } from './../utilities';

import { Request, Response } from 'express';

//this should decide what element to render and create the model to pass to the pages
export class FormBuilder {
  public static build(
    req: Request,
    res: Response,
    parent: DataManagerDataObject,
    children: DataManagerDataObject[] | null = null,
    validationErrors: { [key: string]: string } = {}
  ): void | Response {
    let template = '';
    //check the types here
    if (parent?._listOfValuesLength && parent?._listOfValuesLength > 0 && parent?._listOfValuesLength < 10) {
      template = 'forms/radio-group';
    } else if (parent?._listOfValuesLength && parent?._listOfValuesLength >= 10) {
      template = 'forms/type-ahead';
    } else if (parent?._isCategoryPage) {
      template = 'forms/checkbox-group';
    } else {
      throw new Error(ErrorMessages.UNEXPECTED_ERROR);
    }

    if (children) {
      children = CustomSort.alphabeticalAscOtherLast<DataManagerDataObject>(children, req);
    }

    return res.render(template, {
      parent,
      children,
      validationErrors,
    });
  }
}
