import { ErrorMessages } from './../constants';
import { DataManagerDataObject } from './../interfaces';
import { CustomSort, ErrorSort } from './../utilities';

import config from 'config';
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
    const listOfValuesLength = JSON.parse(config.get('radio.listOfValuesLength'));
    //get the template to render
    const template = this.determineTemplate(parent, listOfValuesLength);

    if (children) {
      children = CustomSort.alphabeticalAscOtherLast<DataManagerDataObject>(children, req);

      this.modifyValidationErrors(validationErrors, parent, children, listOfValuesLength);

      //sort errors based on children
      validationErrors = ErrorSort.matchSorting(children, validationErrors);
    }

    return res.render(template, {
      parent,
      children,
      validationErrors,
    });
  }

  private static determineTemplate(parent: DataManagerDataObject, listOfValuesLength: number): string {
    if (!parent) {
      throw new Error(ErrorMessages.PARENT_NOT_FOUND);
    }
    if (parent._listOfValuesLength) {
      if (parent._listOfValuesLength >= listOfValuesLength) {
        return 'forms/type-ahead';
      } else if (parent._listOfValuesLength > 0) {
        return 'forms/radio-group';
      }
    } else if (parent._isCategoryPage) {
      return 'forms/checkbox-group';
    }
    throw new Error(ErrorMessages.UNEXPECTED_ERROR);
  }

  private static modifyValidationErrors(
    validationErrors: { [key: string]: string },
    parent: DataManagerDataObject,
    children: DataManagerDataObject[] | null,
    listOfValuesLength: number
  ): void {
    const keys = Object.keys(validationErrors);

    if (keys.length === 0) {
      return; // No errors to modify
    }

    const errorKey = keys[0];
    const errorKeys = errorKey.split('_enabled-');
    const childrenId = errorKeys[1];
    let newKey = '';

    if (parent._isParent && children) {
      newKey = errorKey.replace(childrenId, children[0].id);
    } else if (parent._listOfValuesLength && parent._listOfValuesLength < listOfValuesLength) {
      newKey = errorKey.replace(childrenId, parent._listOfValues[0].key);
    }

    if (newKey) {
      validationErrors[newKey] = validationErrors[errorKey];
      if (newKey !== errorKey) {
        delete validationErrors[errorKey];
      }
    }
  }
}
