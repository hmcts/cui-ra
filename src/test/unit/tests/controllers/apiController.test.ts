import { Request, Response } from 'express';
import { ApiController } from '../../../../main/controllers';

describe('ApiController', () => {
  let req: Request;
  let res: Response;
  let apiController: ApiController;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    apiController = new ApiController();
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
    res.send = jest.fn();
  });

  describe('postPayload', () => {
    test('should return 201 status and JSON response with URL', async () => {
      await apiController.postPayload(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ url: 'url' });
    });

    //test('should return 500 status and error message when an error occurs', async () => {
    //jest.spyOn(ItemService, 'create').mockRejectedValueOnce(new Error(errorMessage));

    //await apiController.postPayload(req, res);

    //expect(res.status).toHaveBeenCalledWith(500);
    //});
  });

  describe('getPayload', () => {
    test('should return 200 status and JSON response with the provided ID', async () => {
      const id = 'exampleId';
      req.params = { id };

      await apiController.getPayload(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(id);
    });

    //test('should return 500 status and error message when an error occurs', async () => {
    //jest.spyOn(ItemService, 'create').mockRejectedValueOnce(new Error(errorMessage));

    //await apiController.getPayload(req, res);

    //expect(res.status).toHaveBeenCalledWith(500);
    //});
  });
});
