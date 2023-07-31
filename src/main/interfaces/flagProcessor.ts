import { DataManagerDataObject, ReferenceDataFlagType } from '.';

export interface FlagProcessorInterface {
  process(dateTime: string, flag: ReferenceDataFlagType, parentId?: string | null): DataManagerDataObject[];
}
