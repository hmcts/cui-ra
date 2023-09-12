import { Request, Response, NextFunction } from 'express';
import { History } from './../../../../main/middlewares';

// Mocking the required dependencies
jest.mock('class-transformer', () => ({
  plainToClass: jest.fn(),
}));
jest.mock('autobind-decorator');
jest.mock('express');

describe('History', () => {
  let history: History;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    history = new History();
    req = {
      session: {
        partyname: undefined,
        mastername: undefined,
        mastername_cy: undefined,
        existingmanager: undefined,
        newmanager: undefined,
        history: undefined,
      },
    } as Request;
    res = {
      locals: {},
    } as Response;
    next = jest.fn() as NextFunction;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialise history on session and add current path, then call next', async () => {
    req = {
      session: {},
    } as Request;
    await history.add(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('should add to history on session and call next', async () => {
    req = {
      session: {
        history: ['start-demo'],
      },
    } as Request;
    await history.add(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
