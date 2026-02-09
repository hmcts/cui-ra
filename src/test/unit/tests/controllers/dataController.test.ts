import { Request, Response, NextFunction } from 'express';
import { DataController } from '../../../../main/controllers';
import { ErrorMessages, Route } from '../../../../main/constants';
import { UrlRoute } from './../../../../main/utilities';
import { mockLogger, mockRedisClient, mockServiceAuth, mockRefData, mockFlagProcessor } from '../../mocks';
import { Session, SessionData } from 'express-session';
import { DataNotFoundError, MasterNotFoundError } from './../../../../main/errors';
import { ExistingFlagProcessor } from './../../../../main/processors';
import fs from 'fs';

const dataProcessorResultJson = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);

let mockedLogger = mockLogger();
let mockedRedis = mockRedisClient();
let mockedServiceAuth = mockServiceAuth();
let mockedRefData = mockRefData();
let mockedFlagProcessor = mockFlagProcessor();
let existingFlagProcessor = new ExistingFlagProcessor();
const host = 'www.test.com';
const protocol = 'https';
const mockId = 'mockId';

describe('DataController', () => {
  let dataController: DataController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Initialize the mock objects and dependencies
    mockRequest = {
      params: { id: mockId },
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
      existingFlagProcessor,
      mockedServiceAuth
    );
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle 404 when data is not found in the redis store', async () => {
    // Mock the exists method in the redisClient to return false
    mockedRedis.exists = jest.fn().mockResolvedValue(false);

    await dataController.process(mockRequest as Request, mockResponse as Response, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new DataNotFoundError(`Data with ID ${mockId} not found`));
  });

  test('should handle 404 when data is empty in the redis store', async () => {
    // Mock the exists method in the redisClient to return true
    // Mock the get method in the redisClient to return null (empty data)
    mockedRedis.exists = jest.fn().mockResolvedValue(true);
    mockedRedis.get = jest.fn().mockResolvedValue(null);

    await dataController.process(mockRequest as Request, mockResponse as Response, mockNext);

    //expect(mockResponse.status).toHaveBeenCalledWith(404);
    //expect(mockResponse.send).toHaveBeenCalledWith(ErrorMessages.DATA_NOT_FOUND);
    expect(mockNext).toHaveBeenCalledWith(new DataNotFoundError(`Data with ID ${mockId} not found`));
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
          callbackUrl: 'https://service.gov.uk',
          logoutUrl: 'mockLogoutUrl',
        },
      })
    );

    // Mock the process method in flagProcessor to return some processed data
    mockedFlagProcessor.processAll = jest.fn().mockReturnValue(dataProcessorResultJson);

    await dataController.process(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(301);
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      expect.stringContaining(
        UrlRoute.make(
          Route.JOURNEY_DISPLAY_FLAGS,
          { id: 'PF0001-RA0001' },
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

  test('should return 400 when callback URL is not whitelisted', async () => {
    mockedRedis.exists = jest.fn().mockResolvedValue(true);
    mockedRedis.get = jest.fn().mockResolvedValue(
      JSON.stringify({
        idamToken: 'mockIdamToken',
        payload: {
          existingFlags: { details: [] },
          hmctsServiceId: 'mockHmctsServiceId',
          masterFlagCode: 'RA0001',
          callbackUrl: 'mockReturnUrl',
          logoutUrl: 'mockLogoutUrl',
        },
      })
    );

    await dataController.process(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        message: ErrorMessages.INVALID_URL,
      })
    );
  });

  test('should process data and redirect to existing flags when existing flags are found', async () => {
    // Mock the exists method in the redisClient to return true
    // Mock the get method in the redisClient to return a valid payload with existing flags
    mockedRedis.exists = jest.fn().mockResolvedValue(true);
    mockedRedis.delete = jest.fn().mockResolvedValue(true);
    mockedRedis.get = jest.fn().mockResolvedValue(
      JSON.stringify({
        idamToken: 'mockIdamToken',
        payload: {
          existingFlags: {
            partyName: 'john doe',
            roleOnCase: '',
            details: [
              {
                id: 'test01',
                value: {
                  name: 'Infrared receiver (hearing enhancement system)',
                  name_cy: 'Derbynnydd isgoch (system gwella clyw)',
                  path: [
                    {
                      id: 'party',
                      name: 'Party',
                    },
                    {
                      id: 'Reasonable adjustment',
                      name: 'Reasonable adjustment',
                    },
                    {
                      id: 'I need help communicating and understanding',
                      name: 'I need help communicating and understanding',
                    },
                    {
                      id: 'Hearing Enhancement System (Hearing',
                      name: 'Hearing Enhancement System (Hearing',
                    },
                    {
                      id: 'Induction Loop, Infrared Receiver)',
                      name: 'Induction Loop, Infrared Receiver)',
                    },
                  ],
                  hearingRelevant: 'Yes',
                  flagCode: 'RA0044',
                  status: 'Active',
                  availableExternally: 'Yes',
                },
              },
            ],
          },
          hmctsServiceId: 'mockHmctsServiceId',
          masterFlagCode: 'RA0001',
          callbackUrl: 'https://service.gov.uk',
          logoutUrl: 'mockLogoutUrl',
        },
      })
    );

    // Mock the getFlags method in refdata to return some reference data
    mockedRefData.getFlags = jest.fn().mockResolvedValue({});

    // Mock the process method in flagProcessor to return some processed data
    mockedFlagProcessor.processAll = jest.fn().mockReturnValue(dataProcessorResultJson);

    await dataController.process(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(301);
    expect(mockResponse.redirect).toHaveBeenCalledWith(
      expect.stringContaining(
        UrlRoute.make(
          Route.OVERVIEW,
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

    await dataController.process(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Error('Mock Redis Error'));
  });

  test('should throw error as the master code cannot be found', async () => {
    // Mock the exists method in the redisClient to return true
    // Mock the get method in the redisClient to return a valid payload
    mockedRedis.exists = jest.fn().mockResolvedValue(true);
    mockedRedis.get = jest.fn().mockResolvedValue(
      JSON.stringify({
        idamToken: 'mockIdamToken',
        payload: {
          existingFlags: { details: [] },
          hmctsServiceId: 'mockHmctsServiceId',
          masterFlagCode: 'RA9999',
          callbackUrl: 'https://service.gov.uk',
          logoutUrl: 'mockLogoutUrl',
        },
      })
    );

    // Mock the process method in flagProcessor to return some processed data
    mockedFlagProcessor.processAll = jest.fn().mockReturnValue(dataProcessorResultJson);

    await dataController.process(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new MasterNotFoundError(`Master flag with code RA9999 not found`));
  });
});
