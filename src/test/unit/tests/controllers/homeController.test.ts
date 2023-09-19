import fs from 'fs';
import { Request, Response } from 'express';
import { HomeController } from '../../../../main/controllers';
import { Session, SessionData } from 'express-session';
import { PayloadCollectionItem } from '../../../../main/interfaces';
import { ExistingFlagsManager } from '../../../../main/managers';
import { Route } from '../../../../main/constants';

const host = 'www.test.com';
const protocol = 'https';

/* eslint-disable jest/expect-expect */
describe('Home Controller', () => {
  let homeController: HomeController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

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
    homeController = new HomeController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should render home page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.get(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.render).toBeCalledWith('home');
  });

  test('Should render overview page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const existingJson: PayloadCollectionItem[] = JSON.parse(
      fs.readFileSync(__dirname + '/../../../../main/demo/data/demo-payload.json', 'utf-8')
    );
    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
    dataManagerExisting.set(existingJson);

    // Need to set stuff on an actual session here and not the request??
    mockRequest.session = {
      partyName: 'demo',
      existingManager: dataManagerExisting,
    } as unknown as Session & Partial<SessionData>;

    homeController.overview(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.render).toBeCalledWith('overview', expect.any(Object));
  });

  test('Should render intro page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.intro(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.render).toBeCalledWith('intro');
  });

  test('Should render cookies page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.cookies(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.render).toBeCalledWith('cookies');
  });

  test('Should render privacy policy page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.privacyPolicy(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.render).toBeCalledWith('privacy-policy');
  });

  test('Should render terms and conditions page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.termsAndConditions(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.render).toBeCalledWith('terms-and-conditions');
  });

  test('Should render accessibility statement page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.accessibilityStatement(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.render).toBeCalledWith('accessibility-statement');
  });

  test('Should redirect to logoutUrl', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.signOut(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.redirect).toBeCalledWith(host);
    //expect(mockRequest.session?.destroy).toHaveBeenCalled();
  });

  test('Should redirect to root', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    if (mockRequest.session)
    {
      mockRequest.session.logoutUrl = "";

      homeController.signOut(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.redirect).toBeCalledWith(Route.ROOT);
    }
  });

  test('Should clear session data on logout', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    homeController.signOut(mockRequest as Request, mockResponse as Response);
    expect(mockRequest.session?.destroy).toHaveBeenCalled();
  });
});
