import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { DemoController } from '../../../../main/controllers';
import { Session, SessionData } from 'express-session';
import { PayloadCollectionItem } from '../../../../main/interfaces';
import { ExistingFlagsManager } from '../../../../main/managers';
import { UrlRoute } from './../../../../main/utilities';
import { Route } from './../../../../main/constants';
import { ExistingFlagProcessor } from './../../../../main/processors';

const host = 'www.test.com';
const protocol = 'https';

/* eslint-disable jest/expect-expect */
describe('Demo Controller', () => {
  let demoController: DemoController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Initialize the mock objects and dependencies
    mockRequest = {
      body: {},
      params: {},
      query: { action: 'demo' },
      session: { partyName: '', existingManager: {} } as unknown as Session & Partial<SessionData>,
      protocol: protocol,
      headers: {
        host: host,
      },
    } as unknown as Request;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn().mockReturnThis(),
      render: jest.fn().mockReturnThis(),
    } as unknown as Response;
    mockNext = jest.fn();
    demoController = new DemoController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should render demo page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    await demoController.get(mockRequest, mockResponse, mockNext);
    expect(mockResponse.render).toBeCalledWith('demo');
  });

  test('Should render intro page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const id = 'PF0001-RA0001';
    mockRequest.query = { action: 'new' };
    demoController.startDemo(mockRequest, mockResponse, mockNext);

    expect(mockResponse.redirect).toBeCalledWith(
      UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: id }, UrlRoute.url(mockRequest))
    );
  });

  test('Should render intro page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const id = 'PF0001-RA0001';
    mockRequest.query = { action: 'new_cy' };
    demoController.startDemo(mockRequest, mockResponse, mockNext);

    expect(mockResponse.redirect).toBeCalledWith(
      UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: id }, UrlRoute.url(mockRequest))
    );
  });

  test('Should render overview page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const existingJson: PayloadCollectionItem[] = JSON.parse(
      fs.readFileSync(__dirname + '/../../../../main/demo/data/demo-payload.json', 'utf-8')
    );
    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();

    const eprocessor = new ExistingFlagProcessor();
    dataManagerExisting.set(eprocessor.process(existingJson));

    mockRequest.query = { action: 'existing' };

    mockRequest.session = {
      partyName: 'demo',
      existingManager: dataManagerExisting,
    } as unknown as Session & Partial<SessionData>;

    demoController.startDemo(mockRequest, mockResponse, mockNext);
    expect(mockResponse.redirect).toBeCalledWith('home/overview');
  });
});
