import { ServiceAuth } from '../../../main/interfaces';

export const mockServiceAuth = (): ServiceAuth => {
  const serviceAuth: Partial<ServiceAuth> = {
    getOneTimeToken: jest.fn(),
    getToken: jest.fn(),
    validateToken: jest.fn(),
  };

  return serviceAuth as ServiceAuth;
};
