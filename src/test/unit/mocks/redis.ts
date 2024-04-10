import { RedisClientType } from 'redis';
import { RedisClientInterface } from './../../../main/interfaces';

export const mockRedisNode = (): RedisClientType => {
  const mock: RedisClientType = {
    connect: jest.fn(),
    on: jest.fn(),
    set: jest.fn(),
    get: jest.fn().mockResolvedValue('testValue'),
    exists: jest.fn().mockResolvedValue(true),
    del: jest.fn().mockResolvedValue(true),
    ping: jest.fn(),
  } as unknown as RedisClientType;
  return mock as RedisClientType;
};

export const mockRedisClient = (): RedisClientInterface => {
  const mockRedis: RedisClientInterface = {
    async exists(key: string): Promise<boolean> {
      return key === 'existing_key';
    },
    async get(key: string): Promise<string | null> {
      if (key === 'existing_key') {
        return JSON.stringify({ test: 'data' });
      }
      return null;
    },
    async set(key: string, value: string): Promise<void> {
      // Mock the set method if needed
    },
    async delete(key: string): Promise<boolean> {
      return true;
    },
    isConnected(): boolean {
      return true;
    },
    isReady(): boolean {
      return true;
    },
    getClient(): RedisClientType {
      return mockRedisNode();
    },
    generateUUID(): Promise<string> {
      return new Promise(resolve => {
        resolve('random-string-uuid');
      });
    },
  };

  return mockRedis as RedisClientInterface;
};
