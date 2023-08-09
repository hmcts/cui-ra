import { Request, Response } from 'express';
import { ReviewController } from '../../../../main/controllers';
import { Session, SessionData } from 'express-session';

const host = 'www.test.com';
const protocol = 'https';

/* eslint-disable jest/expect-expect */
describe('Review Controller', () => {
  let reviewController: ReviewController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Initialize the mock objects and dependencies
    mockRequest = {
      body: {},
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
    reviewController = new ReviewController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should render review page', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    reviewController.get(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.render).toBeCalledWith('review', expect.any(Object));
  });
});
