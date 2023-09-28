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
      Cookie: axiosCookies
    }
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
  let opt = {
    hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
    screenCapture: `${screenshotDir}/${url.replace(host, '').replace('/', 'slash')}.png`
  };
  Object.assign(opt, options);
  return pa11y(url, opt);
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
      let opt = {};
      if (cookies.length > 0) {
        const pa11yCookies = cookies.map(cookie => ({
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
        }));
        Object.assign(opt, {
          headers: {
            cookie: pa11yCookies,
          }
        })
      }
      await ensurePageCallWillSucceed(url, cookies);
      const result = await runPally(url, opt);
      expect(result.issues).toEqual(expect.any(Array));
      expectNoErrors(result.issues);
    });
  });
}

async function setupSession(url:string): Promise<any[]> {
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.click('#demonew');

  await page.waitForSelector('.logged-in');

  const cookies = await page.cookies(url);

  await browser.close();

  return cookies;
}

describe('Accessibility', () => {
  let cookies:any[] = [];

  beforeAll(async () => {
    cookies = await setupSession(UrlRoute.make(Route.DEMO, {}, host));
  });

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

  //all of the below require a session to exist. this is passed in as cookies
  testAccessibility(UrlRoute.make(Route.INTRO, {}, host), cookies);
  testAccessibility(UrlRoute.make(Route.OVERVIEW, {}, host), cookies);
  testAccessibility(UrlRoute.make(Route.REVIEW, {}, host), cookies);

  //Main Category pages
  testAccessibility(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001' }, host), cookies);
  //Set Radio pages
  testAccessibility(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-RA0001-RA0008-RA0042' }, host), cookies);
  //Set Typeahead pages
  testAccessibility(UrlRoute.make(Route.JOURNEY_DISPLAY_FLAGS, { id: 'PF0001-PF0015' }, host), cookies);
});
