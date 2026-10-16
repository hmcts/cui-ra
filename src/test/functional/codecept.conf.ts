import { config as testConfig } from '../config.js';

import { setHeadlessWhen } from '@codeceptjs/configure';

setHeadlessWhen(testConfig.TestHeadlessBrowser);

export default {
  // headless mode
  show: process.env.SHOW_BROWSER_WINDOW || false,
  name: 'functional',
  gherkin: testConfig.Gherkin,
  noGlobals: true,
  output: '../../../functional-output/functional/reports',
  helpers: testConfig.helpers,
  timeout: 59000,
  tests: './src/test/functional',
  require: ['tsx/esm'],
  plugins: {
    allure: {
      enabled: true,
      require: 'allure-codeceptjs',
    },
    pause: {
      on: 'fail',
      enabled: !testConfig.TestHeadlessBrowser,
    },
    retryFailedStep: {
      enabled: true,
    },
    screenshot: {
      on: 'fail',
      enabled: true,
      fullPageScreenshots: true,
    },
  },
};
