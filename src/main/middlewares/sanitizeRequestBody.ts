import { NextFunction, Request, Response } from 'express';
import striptags from 'striptags';
import traverse from 'traverse';

function sanitizeRequest(req: Request, res: Response, next: NextFunction): void {
  traverse(req.body).forEach(function sanitizeValue(value) {
    if (this.isLeaf && typeof value === 'string') {
      const sanitizedValue = striptags(unescapeHTML(value));
      this.update(sanitizedValue);
    }
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
