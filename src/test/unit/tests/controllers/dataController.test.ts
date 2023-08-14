import { Request, Response } from 'express';
import { DataController } from '../../../../main/controllers';
import { ErrorMessages, Route } from '../../../../main/constants';
import { UrlRoute } from './../../../../main/utilities';
import { mockLogger, mockRedisClient, mockServiceAuth, mockRefData, mockFlagProcessor } from '../../mocks';
import { Session, SessionData } from 'express-session';

let mockedLogger = mockLogger();
let mockedRedis = mockRedisClient();
let mockedServiceAuth = mockServiceAuth();
let mockedRefData = mockRefData();
let mockedFlagProcessor = mockFlagProcessor();
const host = 'www.test.com';
const protocol = 'https';

describe('DataController', () => {
  let dataController: DataController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Initialize the mock objects and dependencies
    mockRequest = {
      params: { id: 'mockId' },
      session: {} as Session & Partial<SessionData>,
      protocol: protocol,
      headers: {
        host: host,
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn(),
    };
    dataController = new DataController(
      mockedLogger,
      mockedRedis,
      mockedRefData,
      mockedFlagProcessor,
      mockedServiceAuth
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle 404 when data is not found in the redis store', async () => {
    // Mock the exists method in the redisClient to return false
    mockedRedis.exists = jest.fn().mockResolvedValue(false);

    await dataController.process(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith(ErrorMessages.DATA_NOT_FOUND);
  });

  test('should handle 404 when data is empty in the redis store', async () => {
    // Mock the exists method in the redisClient to return true
    // Mock the get method in the redisClient to return null (empty data)
    mockedRedis.exists = jest.fn().mockResolvedValue(true);
    mockedRedis.get = jest.fn().mockResolvedValue(null);

    await dataController.process(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith(ErrorMessages.DATA_NOT_FOUND);
  });

  test('should process data and redirect to new flags setup when no existing flags are found', async () => {
    // Mock the exists method in the redisClient to return true
    // Mock the get method in the redisClient to return a valid payload
    mockedRedis.exists = jest.fn().mockResolvedValue(true);
    mockedRedis.get = jest.fn().mockResolvedValue(
      JSON.stringify({
        idamToken: 'mockIdamToken',
        payload: {
          existingFlags: { details: [] },
          hmctsServiceId: 'mockHmctsServiceId',
          masterFlagCode: 'RA0001',
          callbackUrl: 'mockCallbackUrl',
          logoutUrl: 'mockLogoutUrl',
        },
      })
    );

    mockedRefData.getFlags = jest.fn().mockResolvedValue({});
    // Mock the getFlags method in refdata to return some reference data

    // Mock the process method in flagProcessor to return some processed data
    mockedFlagProcessor.process = jest.fn().mockReturnValue([]);

    await dataController.process(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(301);
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      expect.stringContaining(
        UrlRoute.make(
          Route.JOURNEY_NEW_FLAGS,
          {},
          UrlRoute.url({
            protocol: protocol,
            headers: {
              host: host,
            },
          } as Request)
        )
      )
    );
  });

  test('should process data and redirect to existing flags when existing flags are found', async () => {
    // Mock the exists method in the redisClient to return true
    // Mock the get method in the redisClient to return a valid payload with existing flags
    mockedRedis.exists = jest.fn().mockResolvedValue(true);
    mockedRedis.get = jest.fn().mockResolvedValue(
      JSON.stringify({
        idamToken: 'mockIdamToken',
        payload: {
          existingFlags: {
            details: [
              {
                /* mock existing flag data */
              },
            ],
          },
          hmctsServiceId: 'mockHmctsServiceId',
          callbackUrl: 'mockCallbackUrl',
          logoutUrl: 'mockLogoutUrl',
        },
      })
    );

    // Mock the getFlags method in refdata to return some reference data
    mockedRefData.getFlags = jest.fn().mockResolvedValue({});

    // Mock the process method in flagProcessor to return some processed data
    mockedFlagProcessor.process = jest.fn().mockReturnValue([]);

    await dataController.process(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(301);
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      expect.stringContaining(
        UrlRoute.make(
          Route.JOURNEY_EXSITING_FLAGS,
          {},
          UrlRoute.url({
            protocol: protocol,
            headers: {
              host: host,
            },
          } as Request)
        )
      )
    );
  });

  test('should handle unexpected errors and send 500 response', async () => {
    // Mock the exists method in the redisClient to throw an error
    mockedRedis.exists = jest.fn().mockRejectedValue(new Error('Mock Redis Error'));

    await dataController.process(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(ErrorMessages.UNEXPECTED_ERROR);
  });
});
