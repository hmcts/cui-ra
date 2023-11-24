// better handling of unhandled exceptions
process.on('unhandledRejection', reason => {
  throw reason;
});

const url = process.env.TEST_URL ? `${process.env.TEST_URL}/demo` : 'https://cui-ra.aat.platform.hmcts.net/demo';

let featuresToInclude = url.includes('aat') ? './features/**/*.feature' : '';

export const config = {
  TEST_URL: url,
  TestHeadlessBrowser: true,
  TestSlowMo: 250,
  WaitForTimeout: 10000,

  Gherkin: {
    features: featuresToInclude,
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
    waitForAction: 1000,
    waitForNavigation: 'networkidle0',
    ignoreHTTPSErrors: true,
  },
};
