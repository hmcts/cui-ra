module.exports = {
  roots: ['<rootDir>/src/test/smoke'],
  testRegex: '(/src/test/.*|\\.test)\\.(ts|js)$',
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.[jt]s?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(otplib|@otplib/plugin-base32-scure|@scure/base|@noble)/)'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Smoke Test Report',
        outputPath: '<rootDir>/smoke-output/reports/test-report.html',
        includeFailureMsg: true,
      },
    ],
  ],
};
