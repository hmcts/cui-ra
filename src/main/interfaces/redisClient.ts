import { RedisClientType } from 'redis';

export interface RedisClientInterface {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  isConnected(): boolean;
  isReady(): boolean;
  getClient(): RedisClientType | null;
}
