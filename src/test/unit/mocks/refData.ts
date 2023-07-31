import { ReferenceData, ReferenceDataFlagType, FlagResourceType } from './../../../main/interfaces';

export const mockRefData = (): ReferenceData => {
  const mock: ReferenceData = {
    async getFlags(
      serviceToken: string,
      accessToken: string,
      serviceId: string,
      flagType: FlagResourceType,
      welsh: boolean
    ): Promise<ReferenceDataFlagType> {
      return {} as ReferenceDataFlagType;
    },
  };
  return mock as ReferenceData;
};
