const supportedBrowsers = require('./supportedBrowsers.js');

// eslint-disable-next-line no-unused-vars
const browser = process.env.SAUCELABS_BROWSER;
const tunnelName = process.env.TUNNEL_IDENTIFIER || 'reformtunnel';
const url = process.env.TEST_URL ? `${process.env.TEST_URL}/demo` : 'http://localhost:3100/demo';

const getBrowserConfig = (browserGroup) => {
    const browserConfig = [];
    for (const candidateBrowser in supportedBrowsers[browserGroup]) {
        if (candidateBrowser) {
            const desiredCapability = supportedBrowsers[browserGroup][candidateBrowser];
            desiredCapability['sauce:options'].tunnelIdentifier = tunnelName;
            desiredCapability['sauce:options'].acceptSslCerts = true;
            desiredCapability['sauce:options'].tags = ['cui-ra'];
            browserConfig.push({
                browser: desiredCapability.browserName,
                desiredCapabilities: desiredCapability
            });
        } else {
            console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
        }
    }
    return browserConfig;
};

const setupConfig = {
    output: `${process.cwd()}/functional-output`,
    helpers: {
        WebDriver: {
            url: url,
            browser,
            cssSelectorsEnabled: 'true',
            user: process.env.SAUCE_USERNAME,
            key: process.env.SAUCE_ACCESS_KEY,
            region: 'eu',
            sauceConnect: true,
            services: ['sauce'],

            // This line is required to ensure test name and browsers are set correctly for some reason.
            desiredCapabilities: {'sauce:options': {}}
        },
        SauceLabsReportingHelper: {
            require: './SauceLabsReportingHelper.js'
        },
    },
    plugins: {
        autoDelay: {
            enabled: true,
        },
        retryFailedStep: {
            enabled: true,
        },
    },
    Gherkin: {
        features: './../functional/features/**/*.feature',
        steps: ['./../steps/common.ts', './../steps/commonsteps.ts'],
    },
    mocha: {
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: process.env.E2E_CROSSBROWSER_OUTPUT_DIR || './functional-output',
            reportTitle: 'Crossbrowser results',
            inline: true
        }
    },
    multiple: {
        microsoft: {
            browsers: getBrowserConfig('microsoft')
        },
        chrome: {
            browsers: getBrowserConfig('chrome')
        },
        firefox: {
            browsers: getBrowserConfig('firefox')
        },
        safari: {
            browsers: getBrowserConfig('safari')
        }
    }
};

exports.config = setupConfig;