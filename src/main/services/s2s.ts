import { ErrorMessages } from './../constants';
import { S2SError, TokenFormatError, TokenInvalidError, UnauthorisedError } from './../errors';
import { Logger, ServiceAuth } from './../interfaces';

import autobind from 'autobind-decorator';
import { AxiosInstance } from 'axios';
import { authenticator } from "otplib/authenticator";

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
      throw new S2SError('Failed to generate one-time token');
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
        throw new UnauthorisedError(ErrorMessages.UNAUTHORISED);
      }
      if (typeof response.data !== 'string') {
        throw new TokenFormatError(ErrorMessages.SERVICE_TOKEN_INCORRECT_FORMAT);
      }
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get S2S token' + error.message);
      throw error;
    }
  }

  public async validateToken(token: string): Promise<string> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await this.client.get('/details', { headers });
      if (response.status !== 200) {
        throw new TokenInvalidError(ErrorMessages.SERVICE_TOKEN_INVALID);
      }
      if (typeof response.data !== 'string') {
        throw new TokenFormatError(ErrorMessages.SERVICE_TOKEN_INCORRECT_FORMAT);
      }
      return response.data;
    } catch (error) {
      this.logger.error('S2S Token failed validation' + error.message);
      throw error;
    }
  }
}
