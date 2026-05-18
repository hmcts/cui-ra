import { ErrorMessages } from '../constants';
import { UrlRoute } from './urlRoute';

type UrlValidationError = { message: string };

type ValidateUrlsParams = {
  callbackUrl: string;
  logoutUrl?: string;
};

export const validateUrls = ({ callbackUrl, logoutUrl }: ValidateUrlsParams): UrlValidationError[] => {
  const errors: UrlValidationError[] = [];

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!isValidUrl(callbackUrl) || !UrlRoute.isCallbackUrlWhitelisted(callbackUrl)) {
    errors.push({ message: ErrorMessages.INVALID_CALLBACK_URL });
  }

  if (typeof logoutUrl !== 'undefined' && (!isValidUrl(logoutUrl) || !UrlRoute.isCallbackUrlWhitelisted(logoutUrl))) {
    errors.push({ message: ErrorMessages.INVALID_LOGOUT_URL });
  }

  return errors;
};
