import autobind from 'autobind-decorator';
import { Request, Response } from 'express';

@autobind
export class FormController {
  public async get(req: Request, res: Response): Promise<void> {
    res.locals.opts = 
    [
      {
        value: "",
        text: "Select a country"
      },
      {
        value: "France",
        text: "France"
      },
      {
        value: "Wales",
        text: "Wales",
        selected: true
      },
      {
        value: "England",
        text: "England"
      }
    ]

    res.render('dynamic-form');
  }
}