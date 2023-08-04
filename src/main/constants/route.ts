export const Route = {
  ROOT: '/',
  DATA_PROCESS: '/dc/p/:id',
  API_ROOT: '/api/*',
  API_POST_PAYLOAD: '/api/payload',
  API_GET_PAYLOAD: '/api/payload:id',
  JOURNEY_NEW_FLAGS: '/journey/flags/new',
  JOURNEY_EXSITING_FLAGS: '/journey/flags/exisiting',
  INFO: '/info',
  OVERVIEW: '/home/overview',
  INTRO: '/home/intro',
  REVIEW: '/home/review'
} as const;
