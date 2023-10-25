import { PayloadCollectionItem, PayloadDataObject } from '.';

export interface ExistingFlagProcessorInterface {
  process(PayloadFlagData: PayloadCollectionItem[]): PayloadDataObject[];
}
