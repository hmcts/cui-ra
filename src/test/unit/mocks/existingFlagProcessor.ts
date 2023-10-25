import { ExistingFlagProcessorInterface, PayloadDataObject, PayloadCollectionItem } from './../../../main/interfaces';

export const mockExistingFlagProcessor = (): ExistingFlagProcessorInterface => {
  const mock: ExistingFlagProcessorInterface = {
    process(PayloadFlagData: PayloadCollectionItem[]): PayloadDataObject[] {
      return [] as PayloadDataObject[];
    },
  };
  return mock as ExistingFlagProcessorInterface;
};
