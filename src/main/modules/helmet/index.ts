import * as express from 'express';
import helmet from 'helmet';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

const googleAnalyticsDomain = '*.google-analytics.com';
const dynatraqceDomain = '*.dynatrace.com';
const googleTagManager = '*.googletagmanager.com';

const self = "'self'";

/**
 * Module that enables helmet in the application
 */
export class Helmet {
  /*private readonly developmentMode: boolean;

  constructor(developmentMode: boolean) {
    this.developmentMode = developmentMode;
  }*/

  public enableFor(app: express.Express): void {
    //create nonce for inline scripts and styles
    let nonce = randomUUID();

    // include default helmet functions
    const scriptSrc = [
      self,
      googleAnalyticsDomain,
      dynatraqceDomain,
      googleTagManager,
      "'sha256-GUQ5ad8JK5KmEWmROf3LZd9ge94daqNvd8xy9YS1iDw='",
      `'nonce-${nonce}'`,
    ];

    /*if (this.developmentMode) {
      // Uncaught EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval'
      // is not an allowed source of script in the following Content Security Policy directive:
      // "script-src 'self' *.google-analytics.com 'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='".
      // seems to be related to webpack
      scriptSrc.push("'unsafe-eval'");
    }*/

    app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
      // add nonce to every request
      res.locals.cspNonce = nonce;
      next();
    });

    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            connectSrc: [self, dynatraqceDomain, googleAnalyticsDomain, googleTagManager],
            defaultSrc: ["'self'"],
            fontSrc: [self, 'data:'],
            imgSrc: [self, googleAnalyticsDomain, googleTagManager],
            objectSrc: [self],
            scriptSrc,
            styleSrc: [self],
            manifestSrc: [self],
          },
        },
        referrerPolicy: { policy: 'origin' },
      })
    );
  }
}
