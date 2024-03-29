import { randomUUID } from 'crypto';

import { Logger, RedisClientInterface } from './../interfaces';

import autobind from 'autobind-decorator';
import { RedisClientType, createClient } from 'redis';

@autobind
export class RedisClient implements RedisClientInterface {
  private client: RedisClientType;
  private connected = false;
  private ready = false;
  private url: string;

  constructor(
    private logger: Logger,
    private host: string,
    private port: string,
    private key: string,
    private urlStart: string
  ) {
    this.url = `${this.urlStart}://:**REDACTED**@${this.host}:${this.port}`;
    this.client = createClient({
      url: `${this.urlStart}://:${this.key}@${this.host}:${this.port}`,
    });
    //Setup on Events before init connect
    this.client.on('connect', this.onConnect);
    this.client.on('ready', this.onReady);
    this.client.on('disconnect', this.onDisconnect);
    this.client.on('reconnecting', this.onReconnect);
    this.client.on('error', (err: Error) => this.onError(err.message));
    //Init connect to redis
    this.client.connect();
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
    setInterval(() => {
      this.client.ping();
    }, 60000); // 60s
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
    await this.client.set(key, value, { EX: 3600 });
    this.logger.info(`Redis set key ${key}`);
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

  public async generateUUID(): Promise<string> {
    let uuid: string = randomUUID();
    if (await this.exists(uuid)) {
      uuid = await this.generateUUID();
    }
    return uuid;
  }
}
