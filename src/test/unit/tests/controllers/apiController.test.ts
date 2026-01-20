import { Request, Response } from 'express';
import { ApiController } from '../../../../main/controllers';
import { ErrorMessages, HeaderParams } from '../../../../main/constants';
import { mockLogger, mockRedisClient } from '../../mocks';

let mockedLogger = mockLogger();
let mockedRedis = mockRedisClient();

describe('ApiController', () => {
  let controller: ApiController;

  beforeEach(() => {
    controller = new ApiController(mockedLogger, mockedRedis);
  });

  describe('postPayload', () => {
    const mockRequest = (body: any, idamToken?: string | string[], serviceToken?: string | string[]): Request => {
      return {
        body,
        headers: {
          [HeaderParams.IDAM_TOKEN]: idamToken,
          [HeaderParams.SERVICE_TOKEN]: serviceToken,
        },
      } as unknown as Request;
    };

    const mockResponse = (): Response => {
      const res: Partial<Response> = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res as Response;
    };

    test('should return 201 and url when valid tokens and payload are provided', async () => {
      const req = mockRequest({ key: 'value' }, 'valid_idam_token', 'valid_service_token');
      const res = mockResponse();

      await controller.postPayload(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        url: expect.any(String), // You can also check the specific URL format here if needed.
      });
    });

    test('should throw an error when tokens are missing', async () => {
      const req = mockRequest({ key: 'value' });
      const res = mockResponse();

      await controller.postPayload(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({ error: ErrorMessages.TOKENS_NOT_FOUND });
    });

    test('should throw an error when tokens are not in correct format', async () => {
      const req = mockRequest({ key: 'value' }, ['123'], ['123']);
      const res = mockResponse();

      await controller.postPayload(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: ErrorMessages.TOKENS_INCORRECT_FORMAT });
    });

    test('should return 500 when redis set fails', async () => {
      const errorRedis = {
        ...mockedRedis,
        set: jest.fn().mockRejectedValue(new Error('redis failure')),
      };
      controller = new ApiController(mockedLogger, errorRedis as any);
      const req = mockRequest({ key: 'value' }, 'valid_idam_token', 'valid_service_token');
      const res = mockResponse();

      await controller.postPayload(req, res);

      expect(mockedLogger.error).toHaveBeenCalledWith('redis failure');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: ErrorMessages.UNEXPECTED_ERROR });
    });
  });

  describe('getPayload', () => {
    const mockRequest = (id: string): Request => {
      return {
        params: { id },
      } as unknown as Request;
    };

    const mockResponse = (): Response => {
      const res: Partial<Response> = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res as Response;
    };

    test('should return 200 and data when the key exists in redis', async () => {
      const req = mockRequest('existing_key');
      const res = mockResponse();

      await controller.getPayload(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ test: 'data' });
    });

    test('should return 404 when the key does not exist in redis', async () => {
      const req = mockRequest('non_existing_key');
      const res = mockResponse();

      await controller.getPayload(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: ErrorMessages.DATA_NOT_FOUND });
    });

    test('should return 500 when redis get fails', async () => {
      const errorRedis = {
        ...mockedRedis,
        exists: jest.fn().mockResolvedValue(true),
        get: jest.fn().mockRejectedValue(new Error('redis failure')),
      };
      controller = new ApiController(mockedLogger, errorRedis as any);
      const req = mockRequest('existing_key');
      const res = mockResponse();

      await controller.getPayload(req, res);

      expect(mockedLogger.error).toHaveBeenCalledWith('redis failure');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: ErrorMessages.UNEXPECTED_ERROR });
    });
  });
});
