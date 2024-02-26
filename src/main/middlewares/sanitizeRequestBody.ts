import { NextFunction, Request, Response } from 'express';
import striptags from 'striptags';

function sanitizeRequest(req: Request, res: Response, next: NextFunction): void {
  Object.keys(req.body).forEach(formParameter => {
    const value = req.body[formParameter];
    req.body[formParameter] = typeof value === 'string' ? striptags(unescapeHTML(value)) : value;
  });

  next();
}

function unescapeHTML(str) {
  return str
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '""')
    .replaceAll('&apos;', "'")
    .replace('&nbsp;', ' ')
    .replaceAll('&amp;', '&');
}

export { sanitizeRequest };
