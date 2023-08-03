import { Request } from 'express';

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
}
