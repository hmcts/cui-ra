import { app } from '../../main/app';
import fs from 'fs';
import * as supertest from 'supertest';
import { Route } from './../../main/constants';
import { UrlRoute } from './../../main/utilities';
import puppeteer from 'puppeteer';
import axios from 'axios';

const pa11y = require('pa11y');

const port = 53236;
const host = `http://localhost:${port}`;
const server = app.listen(port);
const timeoutInMs = 10 * 1000;

supertest.agent(server);

class Pa11yResult {
  documentTitle: string;
  pageUrl: string;
  issues: PallyIssue[];

  constructor(documentTitle: string, pageUrl: string, issues: PallyIssue[]) {
    this.documentTitle = documentTitle;
    this.pageUrl = pageUrl;
    this.issues = issues;
  }
}

class PallyIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: string;
  typeCode: number;

  constructor(code: string, context: string, message: string, selector: string, type: string, typeCode: number) {
    this.code = code;
    this.context = context;
    this.message = message;
    this.selector = selector;
    this.type = type;
    this.typeCode = typeCode;
  }
}

function convertPuppeteerCookiesToAxiosCookies(puppeteerCookies) {
  return puppeteerCookies.map(cookie => `${cookie.name}=${cookie.value}`);
}

async function ensurePageCallWillSucceed(url: string, cookies: any[] = []): Promise<void> {
  let headers = {};

  // Set cookies in headers if provided
  if (cookies.length > 0) {
    const axiosCookies = convertPuppeteerCookiesToAxiosCookies(cookies);
    headers = {
      Cookie: axiosCookies,
    };
  }

  try {
    const response = await axios.get(url, { headers });

    if (response.status >= 300 && response.status < 400) {
      throw new Error(`Call to ${url} resulted in a redirect to ${response.headers.location}`);
    }

    if (response.status >= 500) {
      throw new Error(`Call to ${url} resulted in internal server error`);
    }
  } catch (error) {
    throw error;
  }
}

function runPally(url: string, options: {} = {}): Promise<Pa11yResult> {
  const screenshotDir = `${__dirname}/../../../functional-output/pa11y`;
  fs.mkdirSync(screenshotDir, { recursive: true });
  let filename = url.replace(/https?:\/\//gi, '').replace(/[^a-zA-Z0-9.-]/g, '_');
  let opt = {
    hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
    screenCapture: `${screenshotDir}/${filename}.png`,
    wait: 500,
  };
  Object.assign(opt, options);

  try {
    return pa11y(url, opt);
  } catch (error) {
    console.error('Error occurred while capturing screenshot:', error);
    return Promise.reject<Pa11yResult>(error);
  }
}

function expectNoErrors(messages: PallyIssue[]): void {
  const errors = messages.filter(m => m.type === 'error');

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    throw new Error(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

function testAccessibility(url: string, cookies: any[] = []): void {
  describe(`Page ${url}`, () => {
    test('should have no accessibility errors', async () => {
      await testAccessibilityNoWrap(url, cookies);
    }, 10000);
  });
}

async function testAccessibilityNoWrap(url: string, cookies: any[] = []): Promise<void> {
  let opt = {};
  if (cookies.length > 0) {
    const pa11yCookies = cookies.map(cookie => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
    }));
    Object.assign(opt, {
      headers: {
        cookie: cookiesToPa11yString(pa11yCookies),
      },
    });
  }
  await ensurePageCallWillSucceed(url, cookies);
  const result = await runPally(url, opt);
  expect(result.issues).toEqual(expect.any(Array));
  expectNoErrors(result.issues);
}

async function setupSession(url: string): Promise<any[]> {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.click('#demonew');

  await page.waitForSelector('.logged-in');

  const cookies = await page.cookies(url);

  await page.close();

  await browser.close();

  return cookies;
}

function cookiesToPa11yString(cookies) {
  if (!Array.isArray(cookies)) {
    throw new Error('Input cookies must be an array.');
  }

  // Map each cookie to a string value pair
  const cookieStrings = cookies.map(cookie => {
    if (!cookie.name || !cookie.value) {
      throw new Error('Cookies must have "name" and "value" properties.');
    }
    return `${cookie.name}=${cookie.value}`;
  });

  // Join the cookie strings with semicolons
  return cookieStrings.join('; ');
}

describe('Accessibility', () => {
  let cookies: any[] = [];

  beforeAll(async () => {
    cookies = await setupSession(UrlRoute.make(Route.DEMO, {}, host));
  }, timeoutInMs);

  afterAll(done => {
    server.close(done); // Close the server after all tests have completed
  });

  // testing accessibility of the home page
  testAccessibility(UrlRoute.make(Route.ROOT, {}, host));
  testAccessibility(UrlRoute.make(Route.COOKIES, {}, host));
  testAccessibility(UrlRoute.make(Route.PRIVACY_POLICY, {}, host));
  testAccessibility(UrlRoute.make(Route.TERMS_AND_CONDITIONS, {}, host));
  testAccessibility(UrlRoute.make(Route.ACCESSIBILITY_STATEMENT, {}, host));
  testAccessibility(UrlRoute.make(Route.DEMO, {}, host));

  //all of the below require a session to exist. this is passed in as cookies. jest beforeall will run before all tests however that is not the case
  //when it comes to dynamicly created test like above with testAccessibility that have the describe and test inside the function

  describe(`Page ${UrlRoute.make(Route.INTRO, {}, host)}`, () => {
    test(
      'should have no accessibility errors',
      async () => {
        await testAccessibilityNoWrap(UrlRoute.make(Route.INTRO, {}, host), cookies);
      },
      timeoutInMs
    );
  });

  describe(`Page ${UrlRoute.make(Route.INTRO, {}, host)}`, () => {
    test(
      'should have no accessibility errors',
      async () => {
        await testAccessibilityNoWrap(UrlRoute.make(Route.OVERVIEW, {}, host), cookies);
      },
      timeoutInMs
    );
  });

  describe(`Page ${UrlRoute.make(Route.REVIEW, {}, host)}`, () => {
    test(
      'should have no accessibility errors',
      async () => {
        await testAccessibilityNoWrap(UrlRoute.make(Route.REVIEW, {}, host), cookies);
      },
      timeoutInMs
    );
  });

  //Main Category pages
  describe(`Page ${UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001' }, host)}`, () => {
    test(
      'should have no accessibility errors',
      async () => {
        await testAccessibilityNoWrap(
          UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001' }, host),
          cookies
        );
      },
      timeoutInMs
    );
  });

  //Set Radio pages
  describe(`Page ${UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001-RA0008-RA0042' }, host)}`, () => {
    test(
      'should have no accessibility errors',
      async () => {
        await testAccessibilityNoWrap(
          UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001-RA0008-RA0042' }, host),
          cookies
        );
      },
      timeoutInMs
    );
  });

  //Set Typeahead pages
  describe(`Page ${UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-PF0015' }, host)}`, () => {
    test(
      'should have no accessibility errors',
      async () => {
        await testAccessibilityNoWrap(
          UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-PF0015' }, host),
          cookies
        );
      },
      timeoutInMs
    );
  });
});
