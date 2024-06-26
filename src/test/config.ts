// better handling of unhandled exceptions
process.on('unhandledRejection', reason => {
  throw reason;
});

const url = process.env.TEST_URL ? `${process.env.TEST_URL}/demo` : 'http://localhost:3100/demo';

export const config = {
  TEST_URL: url,
  TestHeadlessBrowser: true,
  TestSlowMo: 250,
  WaitForTimeout: 10000,

  Gherkin: {
    features: './features/**/*.feature',
    steps: ['../steps/common.ts', '../steps/commonsteps.ts'],
  },
  helpers: {},
};

config.helpers = {
  Playwright: {
    url: config.TEST_URL,
    show: !config.TestHeadlessBrowser,
    browser: 'chromium',
    waitForTimeout: config.WaitForTimeout,
    waitForAction: 100, // wait time before acting like "click", "fillField" etc
    waitForNavigation: 'networkidle0',
    ignoreHTTPSErrors: true,
  },
};
