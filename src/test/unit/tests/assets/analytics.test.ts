import { trackCookiePreferences } from './../../../../main/assets/js/analytics';

describe('trackCookiePreferences', () => {
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  test('pushes loaded cookie preferences to the GTM data layer', () => {
    const browserWindow = {
      dataLayer: [] as Array<Record<string, unknown>>,
    };
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: browserWindow,
    });
    let listener: ((preferences: unknown) => void) | undefined;
    const cookieManager = {
      on: jest.fn((eventName: string, registeredListener: (preferences: unknown) => void) => {
        expect(eventName).toBe('UserPreferencesLoaded');
        listener = registeredListener;
      }),
    };
    const preferences = { analytics: true };

    trackCookiePreferences(cookieManager);
    listener?.(preferences);

    expect(browserWindow.dataLayer).toEqual([
      {
        event: 'Cookie Preferences',
        cookiePreferences: preferences,
      },
    ]);
  });
});