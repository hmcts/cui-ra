import { Request } from 'express';
import config from 'config';
const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('urlRoute');

export class UrlRoute {
  private static reverse(url, obj): string {
    return url.replace(/(\/:\w+\??)/g, function (m, c) {
      c = c.replace(/[/:?]/g, '');
      return obj[c] ? '/' + obj[c] : '';
    });
  }

  public static make(route: string, params: { [key: string]: string }, host: string | null = null): string {
    let url: string = this.reverse(route, params);
    if (host) {
      url = new URL(url, host).href;
    }
    return url;
  }

  public static url(req: Request): string {
    return `${req.protocol}://${req.headers.host}`;
  }

  /**
   * Validates if a callback URL is in the whitelist
   * @param callbackUrl - The URL to validate
   * @returns true if the URL is whitelisted, false otherwise
   */
  public static isCallbackUrlWhitelisted(callbackUrl: string): boolean {
    if (!callbackUrl) {
      return false;
    }
    try {
      // Parse the URL and extract the hostname
      const { hostname, protocol } = new URL(callbackUrl);

      // Define the whitelisted domains and prefixes
      const whitelistedDomains: string[] = config.get('callbackUrlWhitelist.domains');

      // Check if the hostname matches any of the whitelisted domains
      const isDomainWhitelisted = whitelistedDomains.some(domain => hostname.endsWith(domain));

      // Only allow http for localhost; https for whitelisted domains (and localhost)
      const isLocalhost = hostname === 'localhost';
      if (protocol === 'http:') {
        return isLocalhost;
      }
      if (protocol === 'https:') {
        return isDomainWhitelisted || isLocalhost;
      }
      return false;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      logger.warn(`Invalid callback URL: "${callbackUrl}". ${message}`);
      // Return false if the URL is invalid
      return false;
    }
  }
}
