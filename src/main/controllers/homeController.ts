import autobind from 'autobind-decorator';
import { Request, Response } from 'express';

@autobind
export class HomeController {
  public async get(req: Request, res: Response): Promise<void> {
    res.render('home');
  }

  public async overview(req: Request, res: Response): Promise<void> {
    res.render('overview');
  }

  public async intro(req: Request, res: Response): Promise<void> {
    res.render('intro');
  }

  public async review(req: Request, res: Response): Promise<void> {
    res.render('review');
  }
}
