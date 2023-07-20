import autobind from 'autobind-decorator';
import { Request, Response } from 'express';

@autobind
export class FormController {
  public async get(req: Request, res: Response): Promise<void> {
    res.render('dynamic-form');
  }
}