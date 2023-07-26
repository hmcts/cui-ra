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
});
