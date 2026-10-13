// better handling of unhandled exceptions
process.on('unhandledRejection', reason => {
  throw reason;
});

const url = process.env.TEST_URL ? `${process.env.TEST_URL}/demo` : 'http://localhost:3100/demo';
const testHeadlessBrowser = true;
const waitForTimeout = 30000;

export const config = {
  TEST_URL: url,
  TestHeadlessBrowser: testHeadlessBrowser,
  TestSlowMo: 250,
  WaitForTimeout: waitForTimeout,

  Gherkin: {
    features: './features/**/*.feature',
    steps: ['../steps/common.ts', '../steps/commonsteps.ts'],
  },
  helpers: {
    Playwright: {
      url,
      show: !testHeadlessBrowser,
      browser: 'chromium' as const,
      waitForTimeout,
      waitForAction: 100, // wait time before acting like "click", "fillField" etc
      waitForNavigation: 'load' as const,
      ignoreHTTPSErrors: true,
    },
  },
};
