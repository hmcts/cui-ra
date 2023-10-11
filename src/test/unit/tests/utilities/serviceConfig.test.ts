import { ServiceConfig } from './../../../../main/utilities'; // Adjust the import path as needed

// Mocking the fs module

describe('ServiceConfig', () => {
  let serviceConfig: ServiceConfig;

  beforeEach(() => {
    serviceConfig = new ServiceConfig();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a ServiceConfig instance', () => {
    expect(serviceConfig).toBeInstanceOf(ServiceConfig);
  });

  it('should return the config', () => {
    const config = { key: 'value', flags: [] };
    serviceConfig['config'] = config; // Access the private 'config' property for testing

    expect(serviceConfig.getConfig()).toEqual(config);
  });

  it('should get a config value by key', () => {
    const config = {
      key: {
        nestedKey: 'nestedValue',
      },
      flags: []
    };
    serviceConfig['config'] = config; // Access the private 'config' property for testing

    expect(serviceConfig.getConfigValue('key.nestedKey')).toEqual('nestedValue');
    expect(serviceConfig.getConfigValue('key.nonExistentKey')).toBeNull();
  });

  it('should get flags', () => {
    const flags = [{ flagCode: 'flag1' }, { flagCode: 'flag2' }];
    serviceConfig['config'] = { flags }; // Access the private 'config' property for testing

    expect(serviceConfig.getFlags()).toEqual(flags);
  });

  it('should merge objects', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };

    const merged = serviceConfig['mergeObjects'](target, source); // Access the private 'mergeObjects' method for testing

    expect(merged).toEqual({ a: 1, b: 3, c: 4 });
  });

});