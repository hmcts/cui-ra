import { ErrorMessages } from './../constants';
import { DataManagerDataObject } from './../interfaces';
import { CustomSort } from './../utilities';

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
    let template = '';
    const listOfValuesLength = JSON.parse(config.get('radio.listOfValuesLength'));
    //check the types here
    if (
      parent?._listOfValuesLength &&
      parent?._listOfValuesLength > 0 &&
      parent?._listOfValuesLength < listOfValuesLength
    ) {
      template = 'forms/radio-group';
    } else if (parent?._listOfValuesLength && parent?._listOfValuesLength >= listOfValuesLength) {
      template = 'forms/type-ahead';
    } else if (parent?._isCategoryPage) {
      template = 'forms/checkbox-group';
    } else {
      throw new Error(ErrorMessages.UNEXPECTED_ERROR);
    }

    if (children) {
      children = CustomSort.alphabeticalAscOtherLast<DataManagerDataObject>(children, req);
      const keys = Object.keys(validationErrors);
      let newKey = '';
      if (keys.length > 0) {
        const errorKey = keys[0];
        if (errorKey.includes('_enabled-')) {
          const errorKeys = errorKey.split('_enabled-');
          const childrenId = errorKeys[1];
          if (parent._isParent) {
            newKey = errorKey.replace(childrenId, children[0].id);
          } else if (parent._listOfValuesLength > 0 && parent._listOfValuesLength < listOfValuesLength) {
            newKey = errorKey.replace(childrenId, parent._listOfValues[0].key);
          }
          validationErrors[newKey] = validationErrors[errorKey];
          if (newKey !== errorKey) {
            delete validationErrors[errorKey];
          }
        } else {
          const newValidationErrors: Map<{ key: string }, string> = new Map();
          for (let i = 0; i < children.length; i++) {
            const childKey = children[i].id;
            for (let j = 0; j < keys.length; j++) {
              const validationKey = keys[j];
              if (validationKey.includes(childKey)) {
                newValidationErrors[validationKey] = validationErrors[validationKey];
                delete validationErrors[validationKey];
              }
            }
          }
          const newValidationKeys = Object.keys(newValidationErrors);
          for (let k = 0; k < newValidationKeys.length; k++) {
            const newValidationKey = newValidationKeys[k];
            const newValidationError = newValidationErrors[newValidationKey];
            validationErrors[newValidationKey] = newValidationError;
          }
        }
      }
    }

    return res.render(template, {
      parent,
      children,
      validationErrors,
    });
  }
}
