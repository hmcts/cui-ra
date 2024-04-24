export const ErrorMessages = {
  DATA_NOT_FOUND: 'The requested data could not be found.',
  TOKENS_NOT_FOUND: 'One or both tokens were not provided.',
  TOKENS_INCORRECT_FORMAT: 'Tokens must be provided as strings.',
  SERVICE_TOKEN_MISSING: 'Service token is missing.',
  SERVICE_TOKEN_INCORRECT_FORMAT: 'Service token must be provided as a string.',
  IDAM_TOKEN_MISSING: 'IDAM token is missing.',
  UNEXPECTED_ERROR: 'The server encountered an unexpected error while processing the request.',
  UNAUTHORIZED: 'Unauthorized: Access to the resource is restricted.',
  MASTER_NOT_FOUND: 'The master flag could not be found.',
  FLAG_CANNOT_BE_EDITED: 'The specified flag cannot be edited.',
  PARENT_NOT_FOUND: 'Parent cannot be found',
} as const;
