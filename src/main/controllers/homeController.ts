import { Status, ErrorMessages, Route } from '../constants';

import autobind from 'autobind-decorator';
import { Request, Response } from 'express';

@autobind
export class HomeController {
  public async get(req: Request, res: Response): Promise<void> {
    res.render('home');
  }

  public async overview(req: Request, res: Response): Promise<void> {
    // Add checks here to ensure the required data is on the session???

    res.render('overview', {
      existingFlags: req.session.existingmanager?.data,
      name: req.session.partyname,
      status: Status,
    });
  }

  public async intro(req: Request, res: Response): Promise<void> {
    res.render('intro');
  }

  public async cookies(req: Request, res: Response): Promise<void> {
    res.render('cookies');
  }

  public async privacyPolicy(req: Request, res: Response): Promise<void> {
    res.render('privacy-policy');
  }

  public async termsAndConditions(req: Request, res: Response): Promise<void> {
    res.render('terms-and-conditions');
  }

  public async accessibilityStatement(req: Request, res: Response): Promise<void> {
    res.render('accessibility-statement');
  }

  public async signOut(req: Request, res: Response): Promise<void> {
    if (!req.session) {
      throw ErrorMessages.UNEXPECTED_ERROR;
    }
    
    // Check if user logged in
      // Clear session

    if (!req.session.logoutUrl) {
      return res.redirect(req.session.logoutUrl)
    }

    return res.redirect(Route.ROOT);
  }
}
