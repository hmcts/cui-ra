import {
  FlagProcessorInterface,
  ReferenceDataFlagType,
  DataManagerDataObject,
  ReferenceDataResponse,
} from './../../../main/interfaces';

export const mockFlagProcessor = (): FlagProcessorInterface => {
  const mock: FlagProcessorInterface = {
    processAll(dateTime: string, response: ReferenceDataResponse): DataManagerDataObject[] {
      return [] as DataManagerDataObject[];
    },
    process(dateTime: string, flag: ReferenceDataFlagType, parentId: string | null = null): DataManagerDataObject[] {
      return [] as DataManagerDataObject[];
    },
  };
  return mock as FlagProcessorInterface;
};
