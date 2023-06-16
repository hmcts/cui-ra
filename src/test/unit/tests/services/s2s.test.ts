import { S2S } from '../../../../main/services';
import { mockAxios, mockLogger } from '../../mocks';

/* eslint-disable jest/expect-expect */
describe('s2s service class', () => {
  const axios = mockAxios();
  const mockedLogger = mockLogger();
  const expectedToken = 'thisisatoken';

  const response = {
    status: 200,
    data: expectedToken,
  };

  const service = new S2S('randomstring', 'servicename', axios, mockedLogger);

  test('Get Service Token', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.post as jest.Mock).mockImplementation(() => Promise.resolve(response));
    expect(await service.getToken()).toEqual(expectedToken);
  });

  test('Get Service Token but throw an error', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.post as jest.Mock).mockRejectedValueOnce({ error: 'Internal Server Error' });
    try {
      await service.getToken();
    } catch (error) {
      expect(error).toEqual({ error: 'Internal Server Error' });
    }
  });

  test('Validate Service Token successfully', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.post as jest.Mock).mockImplementation(() => Promise.resolve(response));
    expect(await service.validateToken(expectedToken)).toEqual(expectedToken);
  });

  test('Validate Service Token but throw an error', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.post as jest.Mock).mockRejectedValueOnce({ error: 'Internal Server Error' });
    try {
      await service.validateToken(expectedToken);
    } catch (error) {
      expect(error).toEqual({ error: 'Internal Server Error' });
    }
  });
});
