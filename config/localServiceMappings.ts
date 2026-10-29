//     SERVICE_REF_DATA_MAPPING: '[{"service":"IA", "serviceCodes":["BFA1"]}, {"service":"CIVIL", "serviceCodes":["AAA6", "AAA7"]}, {"service":"PRIVATELAW", "serviceCodes":["ABA5"]}, {"service":"PUBLICLAW", "serviceCodes":["ABA3"]}, {"service":"SSCS", "serviceCodes":["BBA3"]}, {"service":"ST_CIC", "serviceCodes":["BBA2"]}, {"service":"EMPLOYMENT", "serviceCodes":["BHA1"]}, {"service":"DIVORCE", "serviceCodes":["ABA1"]}, {"service":"FR", "serviceCodes":["ABA2"]}, {"service":"PROBATE", "serviceCodes":["ABA6"]}, {"service":"PCS", "serviceCodes":["AAA3"]}]'

export const localServiceMappings: Record<string, string[]> = {
  IA: ['BFA1'],
  CIVIL: ['AAA6', 'AAA7'],
  PRIVATELAW: ['ABA5'],
  PUBLICLAW: ['ABA3'],
  SSCS: ['BBA3'],
  ST_CIC: ['BBA2'],
  EMPLOYMENT: ['BHA1'],
  DIVORCE: ['ABA1'],
  FR: ['ABA2'],
  PROBATE: ['ABA6'],
  PCS: ['AAA3'],
};
