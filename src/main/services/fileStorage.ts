import { randomUUID } from 'crypto';
import fs from 'fs';

import { Logger, RedisClientInterface } from './../interfaces';

import autobind from 'autobind-decorator';

@autobind
export class FileStorageClient implements RedisClientInterface {
  private connected = false;
  private ready = false;
  private filePath = '/tmp';

  constructor(private logger: Logger) {
    try {
      if (!fs.existsSync(this.filePath)) {
        fs.mkdirSync(this.filePath, { recursive: true });
      }
    } catch (err) {
      this.onError(err.message);
    }

    this.onConnect();
    this.onReady();
  }

  private onError(error: string): void {
    this.logger.error(error);
  }

  private onConnect(): void {
    this.connected = true;
    this.logger.info('File storage connected');
  }

  private onReady(): void {
    this.ready = true;
    this.logger.info('File storage ready');
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public isReady(): boolean {
    return this.ready;
  }

  public async set(key: string, value: string): Promise<void> {
    try {
      const filePath = this.getFilePathForKey(key);
      await fs.promises.writeFile(filePath, value);
    } catch (err) {
      this.onError(err.message);
    }
  }

  public async get(key: string): Promise<string | null> {
    try {
      const filePath = this.getFilePathForKey(key);
      const fileData = await fs.promises.readFile(filePath, 'utf-8');
      return fileData;
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File not found, return null
        return null;
      }
      this.onError(err.message);
      return null;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const filePath = this.getFilePathForKey(key);
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }

  public async delete(key: string): Promise<boolean> {
    try {
      const filePath = this.getFilePathForKey(key);
      await fs.promises.unlink(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }

  private getFilePathForKey(key: string): string {
    return `${this.filePath}/${key}.txt`;
  }

  public getClient(): null {
    return null;
  }

  public async generateUUID(): Promise<string> {
    let uuid: string = randomUUID();
    if (await this.exists(uuid)) {
      uuid = await this.generateUUID();
    }
    return uuid;
  }
}
