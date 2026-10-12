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
  private readonly developmentMode: boolean;

  constructor(developmentMode: boolean) {
    this.developmentMode = developmentMode;
  }

  public enableFor(app: express.Express): void {
    //create nonce for inline scripts and styles
    let nonce = randomUUID();

    // include default helmet functions
    const scriptSrc = [
      self,
      googleAnalyticsDomain,
      dynatraqceDomain,
      googleTagManager,
      "'sha256-HxG8QnSuzJ7kfEbpeSy56iZdQ3DJYcBBLGZBvy96Pi4='",
      "'sha256-L7viC3kUpXu9uCOi97VqCR2bLlMwSQlmLmSuuQ93ngU='",
      "'sha256-cOc8/Q4+OATTqNgYJd+hyNrB9tVugysskuk9pwdRAZ0='",
      "'sha256-rBTfOpsIlR4rBhsbh3QOqa2l3gfu4tj0gZGtO2N9jyc='",
      "'sha256-xwGOGGMGQQ+IV0Om4xzgbDHXUh/+L1c375p0Pb6vF9A='",
      "'sha256-9HGruJg4WccHXas5I1NmLn7tI1TDh6N26o6+/dy8sm4='",
      "'sha256-6P5MeWusqb/jlpqd7IN1W3w5cT0VuxA2/MreM2XUQ04='",
      `'nonce-${nonce}'`,
    ];

    if (this.developmentMode) {
      // Uncaught EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval'
      // is not an allowed source of script in the following Content Security Policy directive:
      // "script-src 'self' *.google-analytics.com 'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='".
      // seems to be related to webpack
      scriptSrc.push("'unsafe-eval'");
    }

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
            defaultSrc: ["'none'"],
            fontSrc: [self, 'data:', 'fonts.gstatic.com'],
            imgSrc: [self, googleAnalyticsDomain, googleTagManager, 'fonts.gstatic.com'],
            objectSrc: [self],
            scriptSrc,
            styleSrc: [self, 'fonts.googleapis.com', '*.googletagmanager.com'],
            manifestSrc: [self],
          },
        },
        referrerPolicy: { policy: 'origin' },
      })
    );
  }
}
