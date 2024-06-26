const LATEST_MAC = 'macOS 13';
const LATEST_WINDOWS = 'Windows 11';

const supportedBrowsers = {
  microsoft: {
    edge_win_latest: {
      browserName: 'MicrosoftEdge',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'CUI E2E Tests - : Edge_Win11',
        extendedDebugging: true,
        capturePerformance: true,
      },
    },
  },
  safari: {
    safari_mac: {
      browserName: 'safari',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'CUI E2E Tests - : MAC_SAFARI',
        seleniumVersion: '3.141.59',
        screenResolution: '1400x1050',
        extendedDebugging: true,
        capturePerformance: true,
      },
    },
  },
  chrome: {
    chrome_win_latest: {
      browserName: 'chrome',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'CUI E2E Tests - : WIN_CHROME_LATEST',
        extendedDebugging: true,
        capturePerformance: true,
      },
    },
    chrome_mac_latest: {
      browserName: 'chrome',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'CUI E2E Tests - : MAC_CHROME_LATEST',
        extendedDebugging: true,
        capturePerformance: true,
      },
    },
  },
  firefox: {
    firefox_win_latest: {
      browserName: 'firefox',
      platformName: LATEST_WINDOWS,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'CUI E2E Tests - : WIN_FIREFOX_LATEST',
        extendedDebugging: true,
        capturePerformance: true,
      },
    },
    firefox_mac_latest: {
      browserName: 'firefox',
      platformName: LATEST_MAC,
      browserVersion: 'latest',
      'sauce:options': {
        name: 'CUI E2E Tests - : MAC_FIREFOX_LATEST',
        extendedDebugging: true,
        capturePerformance: true,
      },
    },
  },
};

module.exports = supportedBrowsers;
