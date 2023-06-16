import { Logger } from './../interfaces';

import autobind from 'autobind-decorator';
import { AxiosInstance } from 'axios';
import { authenticator } from 'otplib';

@autobind
export class S2S {
  constructor(
    private secret: string,
    private service: string,
    private client: AxiosInstance,
    private readonly logger: Logger
  ) {}

  public async getToken(): Promise<string> {
    const oneTimePassword = authenticator.generate(this.secret);
    const microservice = this.service;
    const body = {
      microservice,
      oneTimePassword,
    };
    try {
      const response = await this.client.post('/lease', body);
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
      return response.data;
    } catch (error) {
      this.logger.error('S2S Token failed validation');
      throw error;
    }
  }
}
