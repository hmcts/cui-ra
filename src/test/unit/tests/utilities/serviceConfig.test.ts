import { ServiceConfig } from './../../../../main/utilities';
import fs from 'node:fs'; // Adjust the import path as needed

describe('ServiceConfig', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a ServiceConfig instance', () => {
    const serviceConfig = new ServiceConfig();
    expect(serviceConfig).toBeInstanceOf(ServiceConfig);
  });

  it('should return the config', () => {
    const config = { key: 'value', flags: [] };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(config));

    const serviceConfig = new ServiceConfig();

    expect(serviceConfig.getConfig()).toEqual(config);
  });

  it('should get a config value by key', () => {
    const config = {
      key: {
        nestedKey: 'nestedValue',
      },
      flags: [],
    };

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(config));

    const serviceConfig = new ServiceConfig();

    expect(serviceConfig.getConfigValue('key.nestedKey')).toEqual('nestedValue');
    expect(serviceConfig.getConfigValue('key.nonExistentKey')).toBeNull();
  });

  it('should get flags', () => {
    const flags = [{ flagCode: 'flag1' }, { flagCode: 'flag2' }];

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({ flags }));

    const serviceConfig = new ServiceConfig();

    expect(serviceConfig.getFlags()).toEqual(flags);
  });

  it('should merge objects', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };

    const serviceConfig = new ServiceConfig();
    const merged = serviceConfig['mergeObjects'](target, source); // Access the private 'mergeObjects' method for testing

    expect(merged).toEqual({ a: 1, b: 3, c: 4 });
  });
});
