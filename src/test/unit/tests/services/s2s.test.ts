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
  (axios.post as jest.Mock).mockImplementation(() => Promise.resolve(response));

  test('get service token', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(await service.getToken()).toEqual(expectedToken);
  });

  test('validate service token', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(await service.validateToken(expectedToken)).toEqual(expectedToken);
  });
});
