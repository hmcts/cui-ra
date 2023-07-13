import { PayloadCollectionItem } from '../interfaces';

import { DataManager } from '.';

export class ExistingFlagsManager extends DataManager<PayloadCollectionItem> {
  public setStatus(id: string, status: string): void {
    const item: PayloadCollectionItem | null = this.get(id);
    if (item) {
      item.value.status = status;
      this.save([item]);
    }
  }
}
