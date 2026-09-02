declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

interface CookiePreferenceManager {
  on(eventName: string, listener: (preferences: unknown) => void): void;
}

export function trackCookiePreferences(cookieManager: CookiePreferenceManager): void {
  cookieManager.on('UserPreferencesLoaded', preferences => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'Cookie Preferences',
      cookiePreferences: preferences,
    });
  });
}
