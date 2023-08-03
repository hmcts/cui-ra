import { FlagProcessorInterface, ReferenceDataFlagType, DataManagerDataObject } from './../../../main/interfaces';

export const mockFlagProcessor = (): FlagProcessorInterface => {
  const mock: FlagProcessorInterface = {
    process(dateTime: string, flag: ReferenceDataFlagType, parentId: string | null = null): DataManagerDataObject[] {
      return [] as DataManagerDataObject[];
    },
  };
  return mock as FlagProcessorInterface;
};
