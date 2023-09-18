import fs from 'fs';
import { Request, Response } from 'express';
import { ReviewController } from '../../../../main/controllers';
import { Session, SessionData } from 'express-session';
import { PayloadCollectionItem } from '../../../../main/interfaces';
import { ExistingFlagsManager, NewFlagsManager } from '../../../../main/managers';
import { Status } from '../../../../main/constants';
import { mockRedisClient } from './../../mocks';

const host = 'www.test.com';
const protocol = 'https';

/* eslint-disable jest/expect-expect */
describe('Review Controller', () => {
  let reviewController: ReviewController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockedRedis = mockRedisClient();

  const existingJson: PayloadCollectionItem[] = JSON.parse(
    fs.readFileSync(__dirname + '/../../../../main/demo/data/demo-payload.json', 'utf-8')
  );

  beforeEach(() => {
    const dataManagerExisting: ExistingFlagsManager = new ExistingFlagsManager();
    dataManagerExisting.set(existingJson);

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
    reviewController = new ReviewController(mockedRedis);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should render review page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    reviewController.get(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.render).toBeCalledWith('review', expect.any(Object));
  });

  test('Should set inactive and render review page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const id = 'RA0001-RA0002';

    mockRequest.query = {
      id: id,
    };

    if (mockRequest.session?.existingmanager) {
      expect(mockRequest.session.existingmanager.get(id)?.value.status).toBe(Status.REQUESTED);
    }

    await reviewController.setInactive(mockRequest as Request, mockResponse as Response);

    if (mockRequest.session?.existingmanager) {
      expect(mockRequest.session?.existingmanager.get(id)?.value.status).toBe(Status.INACTIVE);
    }

    expect(mockResponse.redirect).toBeCalledWith('/review');
  });

  test('Should set requested and render review page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const id = 'RA0001-RA0005';

    mockRequest.query = {
      id: id,
    };

    if (mockRequest.session?.existingmanager) {
      expect(mockRequest.session.existingmanager.get(id)?.value.status).toBe(Status.INACTIVE);
    }

    await reviewController.setRequested(mockRequest as Request, mockResponse as Response);

    if (mockRequest.session?.existingmanager) {
      expect(mockRequest.session?.existingmanager.get(id)?.value.status).toBe(Status.REQUESTED);
    }

    expect(mockResponse.redirect).toBeCalledWith('/review');
  });

  test('Should submit review and redirect to callback', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    await reviewController.post(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.redirect).toBeCalledWith('https://localhost/callback/random-string-uuid');
  });
});
