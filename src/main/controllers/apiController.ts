import autobind from 'autobind-decorator';
import { Request, Response } from 'express';

@autobind
export class ApiController {
  public async postPayload(req: Request, res: Response): Promise<void> {
    try {
      //const item: BaseItem = req.body;

      //const newItem = await ItemService.create(item);

      res.status(201).json({
        url: 'url',
      });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }

  public async getPayload(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    try {
      //const item: BaseItem = req.body;

      //const newItem = await ItemService.create(item);

      res.status(200).json(id);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
}
