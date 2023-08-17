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
    redisClient['client'] = mockedRedisNode;
  });

  test('should initialize with default values', () => {
    expect(redisClient.isConnected()).toBe(false);
    expect(redisClient.isReady()).toBe(false);
    expect(redisClient.getClient()).toBeTruthy();
  });

  test('should connect to Redis on instantiation', () => {
    expect(redisClient.getClient().connect).toHaveBeenCalled();
    expect(redisClient.getClient().on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(redisClient.getClient().on).toHaveBeenCalledWith('ready', expect.any(Function));
    expect(redisClient.getClient().on).toHaveBeenCalledWith('disconnect', expect.any(Function));
    expect(redisClient.getClient().on).toHaveBeenCalledWith('reconnecting', expect.any(Function));
    expect(redisClient.getClient().on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  test('should set key-value pair in Redis', async () => {
    await redisClient.set('testKey', 'testValue');
    expect(mockedRedisNode.set).toHaveBeenCalledWith('testKey', 'testValue');
  });

  test('should get value from Redis', async () => {
    const result = await redisClient.get('testKey');
    expect(result).toBe('testValue');
    expect(mockedRedisNode.get).toHaveBeenCalledWith('testKey');
  });

  test('should check if key exists in Redis', async () => {
    const result = await redisClient.exists('testKey');
    expect(result).toBe(true);
    expect(mockedRedisNode.exists).toHaveBeenCalledWith('testKey');
  });

  test('should delete key from Redis', async () => {
    const result = await redisClient.delete('testKey');
    expect(result).toBe(true);
    expect(mockedRedisNode.del).toHaveBeenCalledWith('testKey');
  });

});
