import { DataManagerDataObject, ReferenceDataFlagType, ReferenceDataResponse } from '.';

export interface FlagProcessorInterface {
  processAll(dateTime: string, response: ReferenceDataResponse): DataManagerDataObject[];
  process(dateTime: string, flag: ReferenceDataFlagType, parentId?: string | null): DataManagerDataObject[];
}
