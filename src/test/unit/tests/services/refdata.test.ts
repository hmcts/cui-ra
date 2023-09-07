import fs from 'fs';
import { RefData, flagResourceType, RefDataFlagType } from '../../../../main/services';
import { mockAxios } from '../../mocks';

const axios = mockAxios();

const secret = 'randomstring';
const accessToken = '';
const serviceId = '';

const flagJson = JSON.parse(fs.readFileSync(__dirname + '/../../data/flags.json', 'utf-8'));
const service = new RefData(axios);

const response = {
  status: 200,
  data: flagJson,
};

/* eslint-disable jest/expect-expect */
describe('refdata service class', () => {
  test('Should return a flags object', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(response));

    expect(await service.getFlags(secret, accessToken, serviceId, flagResourceType.PARTY)).toEqual(flagJson);
  });

  test('Should fail to return a flags object, unauthorised', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.get as jest.Mock).mockImplementation(() => Promise.resolve(Object.assign({}, response, { status: 401 })));

    const err = new Error('No flag types could be retrieved');

    try {
      await service.getFlags(secret, accessToken, serviceId, flagResourceType.PARTY);
    } catch (error) {
      expect(error).toEqual(err);
    }
  });

  test('Should fail to return a flags object, nothing returned', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    (axios.get as jest.Mock).mockImplementation(() =>
      Promise.resolve(Object.assign({}, response, { status: 401, data: {} }))
    );

    const err = new Error('No flag types could be retrieved');

    try {
      await service.getFlags(secret, accessToken, serviceId, flagResourceType.PARTY);
    } catch (error) {
      expect(error).toEqual(err);
    }
  });

  test('should initialize flag type and set name', async () => {
    // eslint-disable-line @typescript-eslint/no-empty-function
    const name = 'flag';
    let flag = new RefDataFlagType();
    flag.name = name;

    expect(flag.name).toEqual(name);
  });
});
