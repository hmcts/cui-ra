import { NextFunction, Request, Response } from 'express';
import striptags from 'striptags';

function sanitizeRequest(req: Request, res: Response, next: NextFunction): void {
  Object.keys(req.body).forEach(formParameter => {
    const value = unescapeHTML(req.body[formParameter]);
    req.body[formParameter] = typeof value === 'string' ? striptags(value) : value;
  });

  next();
}

const htmlEntities = {
  nbsp: ' ',
  lt: '<',
  gt: '>',
  quot: '"',
  amp: '&',
  apos: "'",
};

function unescapeHTML(str) {
  return str.replace(/&([^;]+);/g, function (entity, entityCode) {
    //var match;

    if (entityCode in htmlEntities) {
      return htmlEntities[entityCode];
      /*eslint no-cond-assign: 0*/
    } else {
      return entity;
    }
  });
}

export { sanitizeRequest };
