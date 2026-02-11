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
    test.each([
      '',
      'https://example.com/callback',
      'https://evil-site.com/phish',
      'https://service.gov.uk.evil.com/callback',
      'https://example.com/service.gov.uk/callback',
      'https://localhost[/]callback/:id',
      'https://evil-service.gov.uk',
      'http://localhost-app.com/callback',
      'https://localhost.net/callback',
      'http://example.service.gov.uk/callback',
    ])('should return false for non-whitelisted URL: %s', url => {
      const result = UrlRoute.isCallbackUrlWhitelisted(url);

      expect(result).toBe(false);
    });

    test.each([
      'https://example.service.gov.uk/callback',
      'https://example.platform.hmcts.net/callback',
      'https://localhost/callback',
      'http://localhost:3000/callback',
    ])('should return true for whitelisted URL: %s', url => {
      const result = UrlRoute.isCallbackUrlWhitelisted(url);

      expect(result).toBe(true);
    });
  });
});
