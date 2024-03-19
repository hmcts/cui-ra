import { Common } from './../constants';

import { Request } from 'express';

export class CustomSort {
  public static alphabeticalAsc<T>(items: T[], req: Request): T[] {
    return items.sort((a, b) => {
      //Add short if to check if welsh and use name_cy
      const name = req.session.welsh ? 'name_cy' : 'name';
      const nameA = a['value'][name].toUpperCase(); // Convert to uppercase for case-insensitive sorting
      const nameB = b['value'][name].toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }

  public static alphabeticalAscOtherLast<T>(items: T[], req: Request): T[] {
    return items.sort((a, b) => {
      //Add short if to check if welsh and use name_cy
      const nameA = req.session.welsh ? a['value'].name_cy.toUpperCase() : a['value'].name.toUpperCase(); // Convert to uppercase for case-insensitive sorting
      const flagCodeA = a['value'].flagCode;
      const nameB = req.session.welsh ? b['value'].name_cy.toUpperCase() : b['value'].name.toUpperCase();
      const flagCodeB = b['value'].flagCode;

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
}
