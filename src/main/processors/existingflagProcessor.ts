import { ExistingFlagProcessorInterface, PayloadCollectionItem, PayloadDataObject } from '../interfaces';

import { Status } from './../constants';

export class ExistingFlagProcessor implements ExistingFlagProcessorInterface {
  public process(PayloadFlagData: PayloadCollectionItem[]): PayloadDataObject[] {
    const existing: PayloadDataObject[] = [];
    //for each flag
    for (let i = 0; i < PayloadFlagData.length; i++) {
      const payload: PayloadCollectionItem = PayloadFlagData[i];
      existing.push({
        id: payload.id,
        value: payload.value,
        _editable: payload.value.status !== Status.INACTIVE,
      } as PayloadDataObject);
    }
    return existing;
  }
}
