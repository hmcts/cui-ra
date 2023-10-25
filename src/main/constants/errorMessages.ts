export const ErrorMessages = {
  DATA_NOT_FOUND: 'Data not found',
  TOKENS_NOT_FOUND: 'One or both tokens not found',
  TOKENS_INCORRECT_FORMAT: 'Tokens need to be strings',
  SERVICE_TOKEN_MISSING: 'Service token is missing',
  SERVICE_TOKEN_INCORRECT_FORMAT: 'Service token incorrect format. string required',
  IDAM_TOKEN_MISSING: 'idam token is missing',
  UNEXPECTED_ERROR: 'the server encountered an unexpected condition that prevented it from fulfilling the request',
  UNAUTHORISED: 'Unauthorised',
  MASTER_NOT_FOUND: 'Master flag cannot be found',
  FLAG_CANNOT_BE_EDITED: 'The following flag cannot be edited',
} as const;
