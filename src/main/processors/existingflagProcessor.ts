import { ExistingFlagProcessorInterface, PayloadCollectionItem, PayloadDataObject } from '../interfaces';

import { Status } from './../constants';

export class ExistingFlagProcessor implements ExistingFlagProcessorInterface {
  public process(PayloadFlagData: PayloadCollectionItem[]): PayloadDataObject[] {
    const existing: PayloadDataObject[] = [];
    //for each flag
    for (let payload of PayloadFlagData) {
      existing.push({
        id: payload.id,
        value: payload.value,
        _editable: payload.value.status !== Status.INACTIVE,
      } as PayloadDataObject);
    }
    return existing;
  }
}
