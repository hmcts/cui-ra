import { Common, ErrorMessages } from './../constants';
import { DataManagerDataObject } from './../interfaces';

import { Response } from 'express';

//this should decide what element to render and create the model to pass to the pages
export class FormBuilder {
  public static build(
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
      //sort
      children.sort((a, b) => {
        const nameA = a.value.name.toUpperCase(); // Convert to uppercase for case-insensitive sorting
        const flagCodeA = a.value.flagCode;
        const nameB = b.value.name.toUpperCase();
        const flagCodeB = b.value.flagCode;

        // If either object has the name "other", it should be sorted last
        if (flagCodeA === Common.OTHER_FLAG_CODE && flagCodeB !== Common.OTHER_FLAG_CODE) {
          return 1;
        }
        if (flagCodeA !== Common.OTHER_FLAG_CODE && flagCodeB === Common.OTHER_FLAG_CODE) {
          return -1;
        }

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
    return res.render(template, {
      parent,
      children,
      validationErrors,
    });
  }
}
