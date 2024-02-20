import autobind from 'autobind-decorator';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { flow, unescape } from 'lodash';
import { strip } from 'node-emoji';
import sanitizer from 'sanitizer';
import traverse from 'traverse';

@autobind
export class SanitizeRequestBody {
  public async sanitize(req: Request, res: Response, next: NextFunction): RequestHandler {
    try {
      const santizeValue = flow([strip, sanitizer.sanitize, unescape]);

      traverse(req.body).forEach(function sanitizeValue(value) {
        if (this.isLeaf && typeof value === 'string') {
          const sanitizedValue = santizeValue(value);
          this.update(sanitizedValue);
        }
      });
    } finally {
      next();
    }
  }
}
