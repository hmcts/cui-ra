import * as express from 'express';
import helmet from 'helmet';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

const googleAnalyticsDomain = '*.google-analytics.com';
const dynatraqceDomain = '*.dynatrace.com';
const googleTagManager = '*.googletagmanager.com';
const self = "'self'";

//Below are added for preview/debug purpose once tags configured in GA we can remove this
const fontsGstaticDomain = 'fonts.gstatic.com';
const fontsGoogleapisDomain = 'fonts.googleapis.com';
const sslGstaticDomain = 'https://ssl.gstatic.com';
const wwwGstaticDomain = 'https://www.gstatic.com';

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
            fontSrc: [self, 'data:', fontsGstaticDomain],
            imgSrc: [self, googleAnalyticsDomain, googleTagManager, sslGstaticDomain, wwwGstaticDomain],
            objectSrc: [self],
            scriptSrc,
            styleSrc: [self, googleTagManager, fontsGoogleapisDomain],
            manifestSrc: [self],
          },
        },
        referrerPolicy: { policy: 'origin' },
      })
    );
  }
}
