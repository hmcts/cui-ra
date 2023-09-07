import { ReferenceData, FlagResourceType, ReferenceDataResponse } from './../../../main/interfaces';

export const mockRefData = (): ReferenceData => {
  const mock: ReferenceData = {
    async getFlags(
      serviceToken: string,
      accessToken: string,
      serviceId: string,
      flagType: FlagResourceType,
      welsh: boolean
    ): Promise<ReferenceDataResponse> {
      return {} as ReferenceDataResponse;
    },
  };
  return mock as ReferenceData;
};
