import axios, { AxiosResponse } from 'axios';
import config from 'config';
import { authenticator } from 'otplib';

export class S2S {
  private readonly service: string;
  private readonly secret: string;
  private readonly url: string;

  constructor() {
    this.secret = config.get('services.s2s.secret');
    this.url = config.get('services.s2s.endpoint');
    this.service = config.get('serviceName');
  }

  public getToken(): string | null {
    const oneTimePassword = authenticator.generate(this.secret);
    const microservice = this.service;
    const body = {
      microservice,
      oneTimePassword,
    };

    axios
      .post(new URL('/lease', this.url).toString(), body)
      .then((response: AxiosResponse) => {
        const responseData = JSON.stringify(response.data);
        console.log(responseData);
        return responseData;
      })
      .catch((error: AxiosResponse) => {
        console.error('Error:', error);
      });
    return null;
  }

  public validateToken(token: string): string | null {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
    axios
      .post(new URL('/details', this.url).toString(), null, {
        headers,
      })
      .then((response: AxiosResponse) => {
        const responseData = JSON.stringify(response.data);
        console.log(responseData);
        return responseData;
      })
      .catch((error: AxiosResponse) => {
        console.error('Error:', error);
      });
    return null;
  }
}
