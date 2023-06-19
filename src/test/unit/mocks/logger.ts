import { Logger } from './../../../main/interfaces';

export const mockLogger = (): Logger => {
  const logger: Partial<Logger> = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  return logger as Logger;
};
