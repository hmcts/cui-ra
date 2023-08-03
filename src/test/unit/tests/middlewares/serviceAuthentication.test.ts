import { Request, Response, NextFunction } from 'express';

import { mockServiceAuth } from './../../mocks';
import { ServiceAuthentication } from './../../../../main/middlewares';
import { ServiceAuth } from './../../../../main/interfaces';
import { ErrorMessages } from './../../../../main/constants';

describe('ServiceAuthentication', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let serviceAuthentication: ServiceAuthentication;
  let serviceMock: ServiceAuth;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
    next = jest.fn();
    serviceMock = mockServiceAuth();
    serviceAuthentication = new ServiceAuthentication(serviceMock);

    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn();
  });

  test('should return 401 status and error response when service token is missing', async () => {
    await serviceAuthentication.check(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: ErrorMessages.SERVICE_TOKEN_MISSING });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 400 status and error response when service token has incorrect format', async () => {
    req.headers = { 'service-token': ['123', '456'] };

    await serviceAuthentication.check(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: ErrorMessages.SERVICE_TOKEN_INCORRECT_FORMAT });
    expect(next).not.toHaveBeenCalled();
  });

  test('should call the next function when service token is valid', async () => {
    req.headers = { 'service-token': 'validToken' };

    (serviceMock.validateToken as jest.Mock).mockImplementation(() => Promise.resolve('validToken'));

    await serviceAuthentication.check(req, res, next);

    expect(serviceMock.validateToken).toHaveBeenCalledWith('validToken');
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return 401 status and error response when service token is invalid', async () => {
    const errorMessage = 'Invalid token';
    req.headers = { 'service-token': 'invalidToken' };

    (serviceMock.validateToken as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await serviceAuthentication.check(req, res, next);

    expect(serviceMock.validateToken).toHaveBeenCalledWith('invalidToken');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: ErrorMessages.UNAUTHORISED });
    expect(next).not.toHaveBeenCalled();
  });
});
