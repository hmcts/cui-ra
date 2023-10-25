import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { HomeController } from '../../../../main/controllers';
import { Session, SessionData } from 'express-session';
import { PayloadCollectionItem } from '../../../../main/interfaces';
import { ExistingFlagsManager } from '../../../../main/managers';
import { Route } from '../../../../main/constants';
import { ExistingFlagProcessor } from './../../../../main/processors';

const host = 'www.test.com';
const protocol = 'https';

/* eslint-disable jest/expect-expect */
describe('Home Controller', () => {
  let homeController: HomeController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  const eprocessor = new ExistingFlagProcessor();

  beforeEach(() => {
    // Initialize the mock objects and dependencies
    mockRequest = {
      body: {},
      params: {},
      session: {
        partyName: '',
        logoutUrl: host,
        existingManager: {},
        destroy: jest.fn().mockImplementation(),
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
    };
    mockNext = jest.fn();
    homeController = new HomeController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should render home page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.get(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.render).toBeCalledWith('home');
  });

  test('Should throw error rendering home page', async () => {
    mockResponse.render = jest.fn().mockImplementation(() => {
      throw new Error('User not found');
    });

    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.get(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toBeCalledWith(new Error('User not found'));
  });

  test('Should render overview page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const existingJson: PayloadCollectionItem[] = JSON.parse(
      fs.readFileSync(__dirname + '/../../../../main/demo/data/demo-payload.json', 'utf-8')
    );
    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
    dataManagerExisting.set(eprocessor.process(existingJson));

    // Need to set stuff on an actual session here and not the request??
    mockRequest.session = {
      partyName: 'demo',
      existingManager: dataManagerExisting,
    } as unknown as Session & Partial<SessionData>;

    homeController.overview(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.render).toBeCalledWith('overview', expect.any(Object));
  });

  test('Should throw error rendering overview page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const existingJson: PayloadCollectionItem[] = JSON.parse(
      fs.readFileSync(__dirname + '/../../../../main/demo/data/demo-payload.json', 'utf-8')
    );
    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
    dataManagerExisting.set(eprocessor.process(existingJson));

    // Need to set stuff on an actual session here and not the request??
    mockRequest.session = {
      partyName: 'demo',
      existingManager: dataManagerExisting,
    } as unknown as Session & Partial<SessionData>;

    mockResponse.render = jest.fn().mockImplementation(() => {
      throw new Error('User not found');
    });

    homeController.overview(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toBeCalledWith(new Error('User not found'));
  });

  test('Should render intro page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.intro(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.render).toBeCalledWith('intro');
  });

  test('Should throw error rendering intro page', async () => {
    mockResponse.render = jest.fn().mockImplementation(() => {
      throw new Error('User not found');
    });
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.intro(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toBeCalledWith(new Error('User not found'));
  });

  test('Should render cookies page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.cookies(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.render).toBeCalledWith('cookies');
  });

  test('Should throw error rendering cookies page', async () => {
    mockResponse.render = jest.fn().mockImplementation(() => {
      throw new Error('User not found');
    });
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.cookies(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toBeCalledWith(new Error('User not found'));
  });

  test('Should render privacy policy page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.privacyPolicy(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.render).toBeCalledWith('privacy-policy');
  });

  test('Should throw error rendering privacy policy page', async () => {
    mockResponse.render = jest.fn().mockImplementation(() => {
      throw new Error('User not found');
    });
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.privacyPolicy(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toBeCalledWith(new Error('User not found'));
  });

  test('Should render terms and conditions page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.termsAndConditions(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.render).toBeCalledWith('terms-and-conditions');
  });

  test('Should throw error rendering terms and conditions page', async () => {
    mockResponse.render = jest.fn().mockImplementation(() => {
      throw new Error('User not found');
    });
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.termsAndConditions(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toBeCalledWith(new Error('User not found'));
  });

  test('Should render accessibility statement page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.accessibilityStatement(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.render).toBeCalledWith('accessibility-statement');
  });

  test('Should throw error rendering accessibility statement page', async () => {
    mockResponse.render = jest.fn().mockImplementation(() => {
      throw new Error('User not found');
    });
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.accessibilityStatement(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toBeCalledWith(new Error('User not found'));
  });

  test('Should redirect to logoutUrl', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.signOut(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockResponse.redirect).toBeCalledWith(host);
    //expect(mockRequest.session?.destroy).toHaveBeenCalled();
  });

  test('Should throw error rendering to logoutUrl', async () => {
    mockRequest.session = {
      destroy: jest.fn().mockImplementation(() => {
        throw new Error('User not found');
      }),
    } as unknown as Session & Partial<SessionData>;
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.signOut(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toBeCalledWith(new Error('User not found'));
    //expect(mockRequest.session?.destroy).toHaveBeenCalled();
  });

  test('Should redirect to root', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    if (mockRequest.session) {
      mockRequest.session.logoutUrl = '';

      homeController.signOut(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockResponse.redirect).toBeCalledWith(Route.ROOT);
    }
  });

  test('Should clear session data on logout', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.signOut(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockRequest.session?.destroy).toHaveBeenCalled();
  });
});
