import fs from 'fs';
import { Request, Response } from 'express';
import { DemoController } from '../../../../main/controllers';
import { Session, SessionData } from 'express-session';
import { PayloadCollectionItem } from '../../../../main/interfaces';
import { ExistingFlagsManager } from '../../../../main/managers';

const host = 'www.test.com';
const protocol = 'https';

/* eslint-disable jest/expect-expect */
describe('Demo Controller', () => {
  let demoController: DemoController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Initialize the mock objects and dependencies
    mockRequest = {
      body: { action: 'demo' },
      params: {},
      session: { partyName: '', existingManager: {} } as unknown as Session & Partial<SessionData>,
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
    demoController = new DemoController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should render demo page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    await demoController.get(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.render).toBeCalledWith('demo');
  });

  test('Should render intro page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    mockRequest.body = { action: 'new' };

    demoController.post(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.redirect).toBeCalledWith('home/intro');
  });

  test('Should render overview page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const existingJson: PayloadCollectionItem[] = JSON.parse(
      fs.readFileSync(__dirname + '/../../../../main/demo/data/demo-payload.json', 'utf-8')
    );
    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
    dataManagerExisting.set(existingJson);

    mockRequest.body = { action: 'existing' };

    mockRequest.session = {
      partyName: 'demo',
      existingManager: dataManagerExisting,
    } as unknown as Session & Partial<SessionData>;

    demoController.post(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.redirect).toBeCalledWith('home/overview');
  });
});
