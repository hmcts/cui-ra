import { DataManagerDataObject, ReferenceDataFlagType, ReferenceDataResponse } from '.';

export interface FlagProcessorInterface {
  processAll(dateTime: string, response: ReferenceDataResponse, welsh?: boolean): DataManagerDataObject[];
  process(dateTime: string, flag: ReferenceDataFlagType, parentId?: string | null, welsh?: boolean): DataManagerDataObject[];
}
