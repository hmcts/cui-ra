import { RedisClient } from './../../../../main/services';
import { mockLogger, mockRedisNode } from './../../mocks';
import redis from 'redis';

jest.mock('redis', () => ({
  createClient: jest.fn(),
}));

describe('RedisClient', () => {
  let mockedLogger = mockLogger();
  let mockedRedisNode = mockRedisNode();
  let redisClient: RedisClient;
  (redis.createClient as jest.Mock).mockReturnValue(mockedRedisNode);

  //const createClientMock = jest.fn();
  //createClientMock.mockImplementation(() => mockedRedisNode());
  //jest.spyOn(redis, 'createClient').mockImplementation(() => mockedRedisNode);
  //jest.spyOn(redis, 'createClient').mockReturnValue(mockedRedisNode());

  const host = 'localhost';
  const port = '6379';
  const key = 'redis-key';

  beforeEach(() => {
    //jest.clearAllMocks();
    redisClient = new RedisClient(mockedLogger, host, port, key);
  });

  test('should initialize with default values', () => {
    expect(redisClient.isConnected()).toBe(false);
    expect(redisClient.isReady()).toBe(false);
    expect(redisClient.getClient()).toBeTruthy();
  });

  // test('should connect to Redis on instantiation', () => {
  //   expect(redisClient.getClient().connect).toHaveBeenCalled();
  //   expect(redisClient.getClient().on).toHaveBeenCalledTimes(5);
  //   expect(redisClient.getClient().on).toHaveBeenCalledWith('connect', expect.any(Function));
  //   expect(redisClient.getClient().on).toHaveBeenCalledWith('ready', expect.any(Function));
  //   expect(redisClient.getClient().on).toHaveBeenCalledWith('disconnect', expect.any(Function));
  //   expect(redisClient.getClient().on).toHaveBeenCalledWith('reconnecting', expect.any(Function));
  //   expect(redisClient.getClient().on).toHaveBeenCalledWith('error', expect.any(Function));
  // });

  //test('should handle "connect" event', () => {
  //   expect(redisClient.isConnected()).toBe(true);
  //   expect(mockedLogger.info).toHaveBeenCalledWith('Redis Connected');
  //});

  // test('should handle "ready" event', () => {
  //   const onReadyCallback = (redisClient.getClient() as jest.Mocked<Partial<RedisClientType>>).on.mock.calls[1]?.[1] as Function|undefined;
  //   if(onReadyCallback){
  //     onReadyCallback();
  //   }
  //   expect(redisClient.isReady()).toBe(true);
  //   expect(mockedLogger.info).toHaveBeenCalledWith('Redis Ready');
  // });

  // test('should handle "ready" event', () => {
  //   const redisClientInstance = redisClient.getClient();
  //   if (redisClientInstance) {
  //     const onReadyCallback = (redisClientInstance as Partial<RedisClientType>).on.mock.calls[1][1] as Function;
  //     if (onReadyCallback) {
  //       onReadyCallback();
  //     }
  //   }
  //   expect(redisClient.isReady()).toBe(true);
  //   expect(mockedLogger.info).toHaveBeenCalledWith('Redis Ready');
  // });

  // test('should handle "disconnect" event', () => {
  //   const onDisconnectCallback = (redisClient.getClient() as Partial<RedisClientType>).on.mock.calls[2]?.[1] as Function;
  //   onDisconnectCallback();
  //   expect(redisClient.isConnected()).toBe(false);
  //   expect(mockedLogger.info).toHaveBeenCalledWith('Redis Disconnect');
  // });

  // test('should handle "reconnecting" event', () => {
  //   const onReconnectCallback = (redisClient.getClient() as Partial<RedisClientType>).on.mock.calls[3]?.[1] as Function;
  //   onReconnectCallback();
  //   expect(redisClient.isConnected()).toBe(false);
  //   expect(mockedLogger.info).toHaveBeenCalledWith('Redis attempting to Re-Connected');
  // });

  // test('should handle Redis client errors', () => {
  //   const errorMessage = 'Test error message';
  //   const onErrorCallback  = (redisClient.getClient() as Partial<RedisClientType>).on.mock.calls[4]?.[1] as Function;
  //   onErrorCallback(new Error(errorMessage));
  //   expect(mockedLogger.error).toHaveBeenCalledWith(errorMessage);
  // });
});
