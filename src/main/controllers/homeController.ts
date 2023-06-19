import autobind from 'autobind-decorator';
import { Request, Response } from 'express';

@autobind
export class HomeController {
  public async get(req: Request, res: Response): Promise<void> {
    res.render('home');
  }
}
