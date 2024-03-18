import { Route, Status } from '../constants';
import { CustomSort } from '../utilities';

import autobind from 'autobind-decorator';
import { NextFunction, Request, Response } from 'express';

@autobind
export class HomeController {
  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('home');
    } catch (e) {
      return next(e);
    }
  }

  public async overview(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  public async intro(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('intro');
    } catch (e) {
      return next(e);
    }
  }

  public async cookies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('cookies');
    } catch (e) {
      return next(e);
    }
  }

  public async privacyPolicy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('privacy-policy');
    } catch (e) {
      return next(e);
    }
  }

  public async termsAndConditions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('terms-and-conditions');
    } catch (e) {
      return next(e);
    }
  }

  public async accessibilityStatement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.render('accessibility-statement');
    } catch (e) {
      return next(e);
    }
  }

  public async signOut(req: Request, res: Response, next: NextFunction): Promise<void> {
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
