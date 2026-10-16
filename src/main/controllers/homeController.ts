import { Route, Status } from '../constants';
import { CustomSort } from '../utilities';

import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';

@autobind
export class HomeController {
  public get(req: Request, res: Response, next: NextFunction): void {
    try {
      res.render('home');
    } catch (e) {
      return next(e);
    }
  }

  public overview(req: Request, res: Response, next: NextFunction): void {
    // Add checks here to ensure the required data is on the session???
    try {
      res.render('overview', {
        existingFlags: CustomSort.alphabeticalAsc(req.session.existingmanager?.data ?? [], req),
        name: req.session.partyname,
        status: Status,
      });
    } catch (e) {
      return next(e);
    }
  }

  public intro(req: Request, res: Response, next: NextFunction): void {
    try {
      res.render('intro');
    } catch (e) {
      return next(e);
    }
  }

  public cookies(req: Request, res: Response, next: NextFunction): void {
    try {
      res.render('cookies');
    } catch (e) {
      return next(e);
    }
  }

  public privacyPolicy(req: Request, res: Response, next: NextFunction): void {
    try {
      res.render('privacy-policy');
    } catch (e) {
      return next(e);
    }
  }

  public termsAndConditions(req: Request, res: Response, next: NextFunction): void {
    try {
      res.render('terms-and-conditions');
    } catch (e) {
      return next(e);
    }
  }

  public accessibilityStatement(req: Request, res: Response, next: NextFunction): void {
    try {
      res.render('accessibility-statement');
    } catch (e) {
      return next(e);
    }
  }

  public signOut(req: Request, res: Response, next: NextFunction): void {
    try {
      const logoutUrl = req.session.logoutUrl;

      req.session.destroy(function () {});

      if (logoutUrl) {
        return res.redirect(logoutUrl);
      }

      return res.redirect(Route.ROOT);
    } catch (e) {
      return next(e);
    }
  }
}
