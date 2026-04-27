import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { ReviewController } from '../../../../main/controllers';
import { Session, SessionData } from 'express-session';
import { PayloadCollectionItem } from '../../../../main/interfaces';
import { ExistingFlagsManager, NewFlagsManager } from '../../../../main/managers';
import { ErrorMessages, Status, Route } from '../../../../main/constants';
import { UrlRoute } from '../../../../main/utilities';
import { mockLogger, mockRedisClient } from './../../mocks';
import { ExistingFlagProcessor } from './../../../../main/processors';

const host = 'www.test.com';
const protocol = 'https';

/* eslint-disable jest/expect-expect */
describe('Review Controller', () => {
  let reviewController: ReviewController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockedLogger = mockLogger();
  let mockedRedis = mockRedisClient();
  let mockNext: NextFunction;

  const existingJson: PayloadCollectionItem[] = JSON.parse(
    fs.readFileSync(__dirname + '/../../data/flags-payload.json', 'utf-8')
  );

  const eprocessor = new ExistingFlagProcessor();
  let processed = eprocessor.process(existingJson);

  beforeEach(() => {
    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
    dataManagerExisting.set(processed);

    const dataManagerNew: NewFlagsManager = new NewFlagsManager();
    dataManagerNew.set([]);

    // Initialize the mock objects and dependencies
    mockRequest = {
      body: {},
      query: {},
      params: {},
      session: {
        partyName: 'demo name',
        existingmanager: dataManagerExisting,
        callbackUrl: 'https://localhost/callback/:id',
        logoutUrl: 'https://localhost/logout',
        newmanager: dataManagerNew,
        destroy: () => {},
      } as unknown as Session & Partial<SessionData>,
      protocol: protocol,
      headers: {
        host: host,
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn().mockReturnThis(),
      render: jest.fn().mockReturnThis(),
      set: jest.fn(),
    };
    mockNext = jest.fn();
    reviewController = new ReviewController(mockedLogger, mockedRedis);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should render review page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    reviewController.get(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.render).toHaveBeenCalledWith('review', expect.any(Object));
  });

  test('Should not render review page when URL parsing fails', async () => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
      session: {
        partyName: 'demo name',
        callbackUrl: 'https://localhost[/]callback/:id',
        destroy: () => {},
      } as unknown as Session & Partial<SessionData>,
      protocol: protocol,
      headers: {
        host: host,
      },
    };

    await reviewController.get(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        errors: expect.arrayContaining([expect.objectContaining({ message: ErrorMessages.INVALID_CALLBACK_URL })]),
      })
    );
  });

  test('Should not render review page when callback URL is not whitelisted', async () => {
    mockRequest.session = {
      partyName: 'demo name',
      callbackUrl: 'https://example.com/callback/:id',
      destroy: () => {},
    } as unknown as Session & Partial<SessionData>;

    await reviewController.get(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        errors: expect.arrayContaining([expect.objectContaining({ message: ErrorMessages.INVALID_CALLBACK_URL })]),
      })
    );
  });

  test('Should not render review page when URL building throws non-error', async () => {
    const whitelistSpy = jest.spyOn(UrlRoute, 'isCallbackUrlWhitelisted').mockReturnValue(true);
    const makeSpy = jest.spyOn(UrlRoute, 'make').mockImplementation(() => {
      throw 'boom';
    });

    reviewController.get(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Error(ErrorMessages.UNEXPECTED_ERROR + 'boom'));

    whitelistSpy.mockRestore();
    makeSpy.mockRestore();
  });

  test('Should render review page with empty editable flags', async () => {
    // Initialize the mock objects and dependencies
    mockRequest = {
      body: {},
      query: {},
      params: {},
      session: {
        partyName: 'demo name',
        callbackUrl: 'https://localhost/callback/:id',
        destroy: () => {},
      } as unknown as Session & Partial<SessionData>,
      protocol: protocol,
      headers: {
        host: host,
      },
    };

    reviewController.get(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.render).toHaveBeenCalledWith(
      'review',
      expect.objectContaining({
        requested: [],
      })
    );
  });

  test('Should fail rendering review page', async () => {
    mockResponse.render = jest.fn().mockImplementation(() => {
      throw new Error('User not found');
    });
    // eslint-disable-line @typescript-eslint/no-empty-function
    reviewController.get(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error('User not found'));
  });

  test('Should set requested to inactive and render review page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const id = 'RA0001-RA0003';

    mockRequest.query = {
      id: id,
    };

    if (mockRequest.session?.existingmanager) {
      expect(mockRequest.session.existingmanager.get(id)?.value.status).toBe(Status.REQUESTED);
    }

    await reviewController.setInactive(mockRequest as Request, mockResponse as Response, mockNext);

    if (mockRequest.session?.existingmanager) {
      expect(mockRequest.session?.existingmanager.get(id)?.value.status).toBe(Status.INACTIVE);
    }

    expect(mockResponse.redirect).toHaveBeenCalledWith(Route.REVIEW);
  });

  test('Should set active to inactive and render review page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const id = 'RA0001-RA0002';

    mockRequest.query = {
      id: id,
    };

    if (mockRequest.session?.existingmanager) {
      expect(mockRequest.session.existingmanager.get(id)?.value.status).toBe(Status.ACTIVE);
    }

    await reviewController.setInactive(mockRequest as Request, mockResponse as Response, mockNext);

    if (mockRequest.session?.existingmanager) {
      expect(mockRequest.session?.existingmanager.get(id)?.value.status).toBe(Status.INACTIVE);
    }

    expect(mockResponse.redirect).toHaveBeenCalledWith(Route.REVIEW);
  });

  test('Should fail to set inactive and render review page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const id = 'RA0001-RA0002';

    mockRequest.query = {
      id: id,
    };

    mockResponse.redirect = jest.fn().mockImplementation(() => {
      throw new Error('User not found');
    });

    await reviewController.setInactive(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Error('User not found'));
  });

  test('Should set requested and render review page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const id = 'RA0001-RA0005';

    mockRequest.query = {
      id: id,
    };

    await reviewController.setRequested(mockRequest as Request, mockResponse as Response, mockNext);

    if (mockRequest.session?.existingmanager) {
      expect(mockRequest.session?.existingmanager?.get(id)?.value.status).toBe(Status.REQUESTED);
    }

    expect(mockResponse.redirect).toHaveBeenCalledWith('/review');
  });

  test('Should fail to set requested and render review page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const id = 'RA0001-RA0002';

    mockRequest.query = {
      id: id,
    };

    mockResponse.redirect = jest.fn().mockImplementation(() => {
      throw new Error('User not found');
    });

    await reviewController.setRequested(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Error('User not found'));
  });

  test('Should cancel and redirect to callback', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    await reviewController.cancel(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.redirect).toHaveBeenCalledWith(302, 'https://localhost/callback/random-string-uuid');
  });

  test('Should fail cancel and redirect to callback', async () => {
    mockRequest.session = undefined;
    // eslint-disable-line @typescript-eslint/no-empty-function
    await reviewController.cancel(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Error(ErrorMessages.UNEXPECTED_ERROR));
  });

  test('Should cancel and redirect to callback', async () => {
    mockRequest.query = { change: 'true' };
    // eslint-disable-line @typescript-eslint/no-empty-function
    await reviewController.cancel(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.redirect).toHaveBeenCalledWith(Route.REVIEW);
  });

  test('Should submit review and redirect to callback', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    await reviewController.post(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.redirect).toHaveBeenCalledWith(new URL('https://localhost/callback/random-string-uuid'));
  });

  test('Should fail to submit review when session is missing', async () => {
    mockRequest.session = undefined;

    await reviewController.post(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 500,
        message: ErrorMessages.UNEXPECTED_ERROR,
      })
    );
  });

  test('Should not submit review when callback URL is not whitelisted', async () => {
    mockRequest.session = {
      partyName: 'demo name',
      callbackUrl: 'https://example.com/callback/:id',
      logoutUrl: 'https://localhost/logout',
      destroy: () => {},
    } as unknown as Session & Partial<SessionData>;

    await reviewController.post(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.redirect).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        errors: expect.arrayContaining([expect.objectContaining({ message: ErrorMessages.INVALID_CALLBACK_URL })]),
      })
    );
  });

  test('Should submit review and wrap URL parsing error', async () => {
    const whitelistSpy = jest.spyOn(UrlRoute, 'isCallbackUrlWhitelisted').mockReturnValue(true);
    const makeSpy = jest.spyOn(UrlRoute, 'make').mockReturnValue('not-a-valid-url');

    await reviewController.post(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.redirect).not.toHaveBeenCalled();
    const error = (mockNext as jest.Mock).mock.calls[0][0] as Error;
    expect(error.message).toContain(ErrorMessages.UNEXPECTED_ERROR);
    expect(error.message).toContain('Invalid URL');

    whitelistSpy.mockRestore();
    makeSpy.mockRestore();
  });

  test('Should submit review and fail to callback', async () => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
      session: {
        partyName: 'demo name',
        callbackUrl: 'https://localhost[/]callback/:id',
        logoutUrl: 'https://localhost/logout',
        destroy: () => {},
      } as unknown as Session & Partial<SessionData>,
      protocol: protocol,
      headers: {
        host: host,
      },
    };
    await reviewController.post(mockRequest as Request, mockResponse as Response, mockNext);
    //expect(mockNext).toBeCalledWith(new Error(ErrorMessages.INVALID_URL));
    const error = (mockNext as jest.Mock).mock.calls[0][0] as {
      errors?: Array<{ message: string }>;
    };
    expect(error.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ message: ErrorMessages.INVALID_CALLBACK_URL })])
    );
  });

  test('Should not cancel when callback URL is not whitelisted', async () => {
    mockRequest.session = {
      partyName: 'demo name',
      callbackUrl: 'https://example.com/callback/:id',
      destroy: () => {},
    } as unknown as Session & Partial<SessionData>;

    await reviewController.cancel(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        errors: expect.arrayContaining([expect.objectContaining({ message: ErrorMessages.INVALID_CALLBACK_URL })]),
      })
    );
  });

  test('Should fail to submit review when logoutUrl is missing', async () => {
    mockRequest.session = {
      partyName: 'demo name',
      callbackUrl: 'https://localhost/callback/:id',
      destroy: () => {},
    } as unknown as Session & Partial<SessionData>;

    await reviewController.post(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 500,
        message: ErrorMessages.UNEXPECTED_ERROR,
      })
    );
  });

  test('Should not submit review when logout URL is not whitelisted', async () => {
    mockRequest.session = {
      partyName: 'demo name',
      callbackUrl: 'https://localhost/callback/:id',
      logoutUrl: 'https://example.com/logout',
      destroy: () => {},
    } as unknown as Session & Partial<SessionData>;

    await reviewController.post(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.redirect).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        errors: expect.arrayContaining([expect.objectContaining({ message: ErrorMessages.INVALID_LOGOUT_URL })]),
      })
    );
  });
});
