module.exports = {
  roots: ['<rootDir>/src/test/routes'],
  testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]s?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(otplib|@otplib/plugin-base32-scure|@scure/base|@noble)/)'],
};
