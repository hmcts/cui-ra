import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { InitSession } from './../../../../main/middlewares';
import { ExistingFlagsManager, NewFlagsManager } from './../../../../main/managers';


// Mocking the required dependencies
jest.mock('class-transformer', () => ({
    plainToClass: jest.fn(),
}));
jest.mock('autobind-decorator');
jest.mock('express');

describe('InitSession', () => {
let initSession: InitSession;
let req: Request;
let res: Response;
let next: NextFunction;

beforeEach(() => {
    initSession = new InitSession();
    req = {
        session: {
            partyname: undefined,
            mastername: undefined,
            mastername_cy: undefined,
            existingmanager: undefined,
            newmanager: undefined
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

test('should initialize session properties and call next if req.session is not present', async () => {
    req = {
        session: {}
    } as Request;
    await initSession.init(req, res, next);

    expect(next).toHaveBeenCalled();
});

test('should initialize session properties and call next', async () => {
    req.session.partyname = 'party';
    req.session.mastername = 'master';
    req.session.mastername_cy = 'cyber';

    const newManager = new NewFlagsManager();
    const exisitingManager = new ExistingFlagsManager();

    req.session.existingmanager = JSON.parse(JSON.stringify(exisitingManager));
    req.session.newmanager = JSON.parse(JSON.stringify(newManager));

    await initSession.init(req, res, next);

    expect(res.locals.partyname).toBe('party');
    expect(res.locals.mastername).toBe('master');
    expect(res.locals.mastername_cy).toBe('cyber');
    expect(plainToClass).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalled();
});

test('should call next if plainToClass throws an error', async () => {
    req.session.partyname = 'party';
    req.session.mastername = 'master';
    req.session.mastername_cy = 'cyber';

    (plainToClass as jest.Mock).mockImplementation(() => {
    throw new Error('Mocked error');
    });

    await initSession.init(req, res, next);

    expect(next).toHaveBeenCalled();
});
});