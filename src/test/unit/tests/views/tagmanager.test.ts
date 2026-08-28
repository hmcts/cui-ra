import { readFileSync } from 'fs';
import { join } from 'path';

describe('Google Tag Manager head template', () => {
  const template = readFileSync(join(process.cwd(), 'src/main/views/tagmanager/head.njk'), 'utf8');

  test('pushes the authenticated service name to the data layer before GTM loads', () => {
    const serviceContextPosition = template.indexOf("event: 'Service context loaded'");
    const gtmLoaderPosition = template.indexOf("'https://www.googletagmanager.com/gtm.js?id='+i+dl");

    expect(template).toContain("service_name: '{{ serviceName }}'");
    expect(serviceContextPosition).toBeGreaterThan(-1);
    expect(gtmLoaderPosition).toBeGreaterThan(serviceContextPosition);
  });
});