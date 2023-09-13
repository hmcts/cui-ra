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
  const urlStart = 'redis';

  beforeEach(() => {
    //jest.clearAllMocks();
    redisClient = new RedisClient(mockedLogger, host, port, key, urlStart);
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

  test('should set connected to true and log connected', () => {
    redisClient['connected'] = true; // Simulate being connected

    // Call the onDisconnect method
    redisClient['onConnect']();

    // Check if connected is set to false
    expect(redisClient['connected']).toBe(true);

    // Check if logger.info is called with the correct message
    expect(mockedLogger.info).toHaveBeenCalledWith(`Redis Connected to ${redisClient['url']}`);
  });

  test('should log error', () => {
    // Call the onDisconnect method
    redisClient['onError']('error');
    // Check if logger.info is called with the correct message
    expect(mockedLogger.error).toHaveBeenCalledWith(`error`);
  });

  test('should set ready to true and log ready', () => {
    redisClient['ready'] = true; // Simulate being connected

    // Call the onDisconnect method
    redisClient['onReady']();

    // Check if connected is set to false
    expect(redisClient['ready']).toBe(true);

    // Check if logger.info is called with the correct message
    expect(mockedLogger.info).toHaveBeenCalledWith(`Redis Ready`);
  });

  test('should set connected to false and log disconnection', () => {
    redisClient['connected'] = true; // Simulate being connected

    // Call the onDisconnect method
    redisClient['onDisconnect']();

    // Check if connected is set to false
    expect(redisClient['connected']).toBe(false);

    // Check if logger.info is called with the correct message
    expect(mockedLogger.info).toHaveBeenCalledWith(`Redis Disconnect from ${redisClient['url']}`);
  });

  test('should set connected to false and log reconnect', () => {
    redisClient['connected'] = false; // Simulate being connected

    // Call the onDisconnect method
    redisClient['onReconnect']();

    // Check if connected is set to false
    expect(redisClient['connected']).toBe(false);

    // Check if logger.info is called with the correct message
    expect(mockedLogger.info).toHaveBeenCalledWith(`Redis attempting to Re-Connected to ${redisClient['url']}`);
  });

  test('should return a unique string', async () => {
    mockedRedisNode.exists = jest.fn().mockResolvedValue(false);
    // Delete data
    const uuid = await redisClient.generateUUID();

    expect(uuid).toEqual(expect.any(String));
  });
});
