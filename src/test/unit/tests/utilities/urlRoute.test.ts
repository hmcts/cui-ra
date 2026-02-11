import { UrlRoute } from '../../../../main/utilities';
import { Request } from 'express';

describe('UrlRoute', () => {
  describe('make', () => {
    test('should generate the correct URL with params and host', () => {
      const route = '/users/:id';
      const params = { id: '123' };
      const host = 'https://example.com';
      const expectedUrl = 'https://example.com/users/123';

      const result = UrlRoute.make(route, params, host);

      expect(result).toBe(expectedUrl);
    });

    test('should generate the correct URL with optional params and host', () => {
      const route = '/posts/:category?';
      const params = { category: 'news' };
      const host = 'https://example.com';
      const expectedUrl = 'https://example.com/posts/news';

      const result = UrlRoute.make(route, params, host);

      expect(result).toBe(expectedUrl);
    });

    test('should generate the correct URL with missing optional params and host', () => {
      const route = '/posts/:category?';
      const params = {};
      const host = 'https://example.com';
      const expectedUrl = 'https://example.com/posts';

      const result = UrlRoute.make(route, params, host);

      expect(result).toBe(expectedUrl);
    });
  });

  describe('url', () => {
    test('should generate the correct URL based on the Request object', () => {
      const mockRequest = {
        protocol: 'https',
        headers: {
          host: 'example.com',
        },
      } as unknown as Request;

      const expectedUrl = 'https://example.com';
      const result = UrlRoute.url(mockRequest);

      expect(result).toBe(expectedUrl);
    });
  });

  describe('isCallbackUrlWhitelisted', () => {
    test('should return false when callbackUrl is empty', () => {
      const result = UrlRoute.isCallbackUrlWhitelisted('');

      expect(result).toBe(false);
    });

    test('should allow whitelisted domain service.gov.uk', () => {
      const result = UrlRoute.isCallbackUrlWhitelisted('https://example.service.gov.uk/callback');

      expect(result).toBe(true);
    });

    test('should allow whitelisted domain platform.hmcts.net', () => {
      const result = UrlRoute.isCallbackUrlWhitelisted('https://a.b.platform.hmcts.net/callback');

      expect(result).toBe(true);
    });

    test('should allow localhost https prefix', () => {
      const result = UrlRoute.isCallbackUrlWhitelisted('https://localhost/callback');

      expect(result).toBe(true);
    });

    test('should allow localhost http prefix', () => {
      const result = UrlRoute.isCallbackUrlWhitelisted('http://localhost:3000/callback');

      expect(result).toBe(true);
    });

    test('should reject non-whitelisted domain', () => {
      const result = UrlRoute.isCallbackUrlWhitelisted('https://example.com/callback');

      expect(result).toBe(false);
    });

    test('should reject known bad domain', () => {
      const result = UrlRoute.isCallbackUrlWhitelisted('https://evil-site.com/phish');

      expect(result).toBe(false);
    });

    test('should reject domain that only contains whitelisted text', () => {
      const result = UrlRoute.isCallbackUrlWhitelisted('https://service.gov.uk.evil.com/callback');

      expect(result).toBe(false);
    });

    test('should reject when whitelisted text appears in path, not domain', () => {
      const result = UrlRoute.isCallbackUrlWhitelisted('https://example.com/service.gov.uk/callback');

      expect(result).toBe(false);
    });

    test('should reject invalid URL', () => {
      const result = UrlRoute.isCallbackUrlWhitelisted('https://localhost[/]callback/:id');

      expect(result).toBe(false);
    });
  });
});
