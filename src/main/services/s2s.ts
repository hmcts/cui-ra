import { Logger, ServiceAuth } from './../interfaces';

import autobind from 'autobind-decorator';
import { AxiosInstance } from 'axios';
import { authenticator } from 'otplib';

@autobind
export class S2S implements ServiceAuth {
  constructor(
    private secret: string,
    private service: string,
    private client: AxiosInstance,
    private readonly logger: Logger
  ) {}

  public getOneTimeToken(): string {
    try {
      return authenticator.generate(this.secret);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async getToken(): Promise<string> {
    try {
      const body = {
        microservice: this.service,
        oneTimePassword: this.getOneTimeToken(),
      };
      const response = await this.client.post('/lease', body);
      if (response.status !== 200) {
        throw new Error('Unauthorized');
      }
      if (typeof response.data !== 'string') {
        throw new Error('Response is not a valid string');
      }
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get S2S token');
      throw error;
    }
  }

  public async validateToken(token: string): Promise<string> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    try {
      const response = await this.client.post('/details', null, { headers });
      if (response.status !== 200) {
        throw new Error('Invalid token');
      }
      if (typeof response.data !== 'string') {
        throw new Error('Response is not a valid string');
      }
      return response.data;
    } catch (error) {
      this.logger.error('S2S Token failed validation');
      throw error;
    }
  }
}
