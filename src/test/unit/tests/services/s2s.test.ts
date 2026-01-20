import { S2S } from '../../../../main/services';
import { mockAxios, mockLogger } from '../../mocks';
import { authenticator } from "otplib/authenticator";
import { S2SError, TokenFormatError, TokenInvalidError, UnauthorisedError } from './../../../../main/errors';
import { ErrorMessages } from './../../../../main/constants';

const axios = mockAxios();
const mockedLogger = mockLogger();
const expectedToken = 'thisisatoken';

const response = {
  status: 200,
  data: expectedToken,
};

const secret = 'randomstring';
const service = new S2S(secret, 'servicename', axios, mockedLogger);

/* eslint-disable jest/expect-expect */
describe('s2s service class', () => {
  test('Should return a token string from Get Service Token', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.post as jest.Mock).mockImplementation(() => Promise.resolve(response));

    expect(await service.getToken()).toEqual(expectedToken);
  });

  test('Should fail to return a token string from Get ServiceToken', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.post as jest.Mock).mockImplementation(() => Promise.resolve(Object.assign({}, response, { status: 401 })));

    try {
      await service.getToken();
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorisedError);
      expect(error.message).toEqual(ErrorMessages.UNAUTHORISED);
    }
  });

  test('Should throw and error when trying to get service token because the return is not a string', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.post as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: {},
      })
    );

    try {
      await service.getToken();
    } catch (error) {
      expect(error).toBeInstanceOf(TokenFormatError);
      expect(error.message).toEqual(ErrorMessages.SERVICE_TOKEN_INCORRECT_FORMAT);
    }
  });

  test('Should throw and error when trying to get service token', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.post as jest.Mock).mockRejectedValueOnce(new S2SError('Failed to get S2S token: Internal Server Error'));

    try {
      await service.getToken();
    } catch (error) {
      expect(error).toBeInstanceOf(S2SError);
      expect(error.message).toEqual('Failed to get S2S token: Internal Server Error');
    }
  });

  test('Validate Service Token successfully', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(response));
    expect(await service.validateToken(expectedToken)).toEqual(expectedToken);
  });

  test('Validate Service Token un-successfully', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(Object.assign({}, response, { status: 401 })));

    try {
      await service.validateToken(expectedToken);
    } catch (error) {
      expect(error).toBeInstanceOf(TokenInvalidError);
      expect(error.message).toEqual(ErrorMessages.SERVICE_TOKEN_INVALID);
    }
  });

  test('Should throw and error when trying to Validate Service Token because the return is not a string', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.get as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        status: 200,
        data: {},
      })
    );

    try {
      await service.validateToken(expectedToken);
    } catch (error) {
      expect(error).toBeInstanceOf(TokenFormatError);
      expect(error.message).toEqual(ErrorMessages.SERVICE_TOKEN_INCORRECT_FORMAT);
    }
  });

  test('Validate Service Token but throw an error', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.get as jest.Mock).mockRejectedValueOnce(new S2SError('Failed to get S2S token: Internal Server Error'));

    try {
      await service.validateToken(expectedToken);
    } catch (error) {
      expect(error).toBeInstanceOf(S2SError);
      expect(error.message).toEqual('Failed to get S2S token: Internal Server Error');
    }
  });

  test('Get one Time token', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function

    const otp = authenticator.generate(secret);

    expect(await service.getOneTimeToken()).toEqual(otp);
  });
});
