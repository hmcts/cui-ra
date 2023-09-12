import { ReferenceData, FlagResourceType, ReferenceDataResponse } from './../../../main/interfaces';
import fs from 'fs';

const flagJson: ReferenceDataResponse = JSON.parse(fs.readFileSync(__dirname + '/../data/flags.json', 'utf-8'));

export const mockRefData = (): ReferenceData => {
  const mock: ReferenceData = {
    async getFlags(
      serviceToken: string,
      accessToken: string,
      serviceId: string,
      flagType: FlagResourceType,
      welsh: boolean
    ): Promise<ReferenceDataResponse> {
      return flagJson;
    },
  };
  return mock as ReferenceData;
};
