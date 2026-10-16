import { config as testConfig } from './config.js';

export const config = {
  name: 'crossbrowser',
  output: `${process.cwd()}/functional-output/crossbrowser`,
  noGlobals: true,

  gherkin: {
    features: './functional/features/**/*.feature',
    steps: ['./steps/common.ts', './steps/commonsteps.ts'],
  },
  helpers: {
    Playwright: {
      ...testConfig.helpers.Playwright,
      channel: '',
    },
  },
  multiple: {
    chrome: {
      browsers: [{ browser: 'chromium', channel: '' }],
    },
    firefox: {
      browsers: [{ browser: 'firefox', channel: '' }],
    },
    safari: {
      browsers: [{ browser: 'webkit', channel: '' }],
    },
    microsoft: {
      browsers: [{ browser: 'chromium', channel: 'msedge' }],
    },
  },
};
