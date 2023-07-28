import { RedisClientType, createClient } from 'redis';
import { RedisClientInterface } from './../../../main/interfaces';

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
      return createClient();
    },
  };

  return mockRedis as RedisClientInterface;
};
