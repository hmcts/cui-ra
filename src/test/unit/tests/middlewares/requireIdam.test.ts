import { Request, Response, NextFunction } from 'express';

import { RequireIdam } from './../../../../main/middlewares';

describe('RequireIdam', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let requireIdam: RequireIdam;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    next = jest.fn();
    requireIdam = new RequireIdam();

    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
  });

  test('should return 401 status and error response when Idam token is missing', async () => {
    await requireIdam.check(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'idam token is missing' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should call the next function when Idam token exists', async () => {
    req.headers = { 'idam-token': 'validToken' };

    await requireIdam.check(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
