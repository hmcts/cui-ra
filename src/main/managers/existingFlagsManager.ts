import { PayloadDataObject } from '../interfaces';

import { DataManager } from '.';

export class ExistingFlagsManager extends DataManager<PayloadDataObject> {
  public setStatus(id: string, status: string): void {
    const item: PayloadDataObject | null = this.get(id);
    if (item && item._editable === true) {
      item.value.status = status;
      this.save([item]);
    }
  }
}
