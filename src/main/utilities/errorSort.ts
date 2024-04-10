import { DataManagerDataObject } from './../interfaces';

export class ErrorSort {
  public static matchSorting(
    items: DataManagerDataObject[],
    validationErrors: { [key: string]: string } = {}
  ): { [key: string]: string } {
    const sortedErrors: { [key: string]: string } = {};

    // Extract and sort errors related to children and remove validationErrors as they are processed
    items.forEach(child => {
      const childrenId = child.id;
      const relatedErrors: { [key: string]: string } = {};
      Object.keys(validationErrors).forEach(errorKey => {
        if (errorKey.includes(`-${childrenId}`)) {
          relatedErrors[errorKey] = validationErrors[errorKey];
          delete validationErrors[errorKey];
        }
      });
      Object.assign(sortedErrors, relatedErrors);
    });

    // Add the validation errors that are not related to children at the end of the sorted errors
    Object.assign(sortedErrors, validationErrors);

    return sortedErrors;
  }
}
