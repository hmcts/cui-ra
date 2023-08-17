import { Logger, RedisClientInterface } from './../interfaces';

import autobind from 'autobind-decorator';
import { RedisClientType, createClient } from 'redis';

@autobind
export class RedisClient implements RedisClientInterface {
  private client: RedisClientType;
  private connected = false;
  private ready = false;
  private url:string;

  constructor(private logger: Logger, private host: string, private port: string, private key: string) {
    this.url = `redis://:**REDACTED**@${this.host}:${this.port}`;
    this.client = createClient({
      url: `redis://:${this.key}@${this.host}:${this.port}`,
      legacyMode: true
    });
    //Setup on Events before init connect
    this.client.on('connect', this.onConnect);
    this.client.on('ready', this.onReady);
    this.client.on('disconnect', this.onDisconnect);
    this.client.on('reconnecting', this.onReconnect);
    this.client.on('error', (err: Error) => this.onError(err.message));
    //Init connect to redis
    this.client.connect().then(() => {
      
    });
  }

  private onError(error: string): void {
    this.logger.error(error);
  }

  private onConnect(): void {
    this.connected = true;
    this.logger.info(`Redis Connected to ${this.url}`);
  }

  private onReady(): void {
    this.ready = true;
    this.logger.info('Redis Ready');
  }

  private onDisconnect(): void {
    this.connected = false;
    this.logger.info(`Redis Disconnect from ${this.url}`);
  }

  private onReconnect(): void {
    this.connected = false;
    this.logger.info(`Redis attempting to Re-Connected to ${this.url}`);
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public isReady(): boolean {
    return this.ready;
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  public async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) >= 1;
  }

  public async delete(key: string): Promise<boolean> {
    return (await this.client.del(key)) >= 1;
  }
}
