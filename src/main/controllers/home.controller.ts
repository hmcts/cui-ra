import { Request, Response } from 'express';
//import { S2S } from './../services';

export class HomeController {
  public get(req: Request, res: Response): void {
    //const s2s = new S2S();
    //const token = s2s.getToken();
    //res.send(token);
    //return;
    res.render('home');
  }
}
