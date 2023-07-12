import { DataManagerDataObject } from '../interfaces';

import { DataManager } from '.';

export class NewFlagsManager extends DataManager<DataManagerDataObject> {
  public getChildren(id: string): DataManagerDataObject[] {
    const item: DataManagerDataObject | null = this.get(id);
    if (!item) {
      return [];
    }
    return this.data.filter((child: DataManagerDataObject) => item._childIds.includes(child.id));
  }

  public getNext(id: string): DataManagerDataObject | null {
    const currentIndex = this.data.findIndex(item => item.id === id);
    if (currentIndex !== -1) {
      for (let i = currentIndex + 1; i < this.data.length; i++) {
        //check if the item is a category page and enabled
        if (this.data[i]._isCategoryPage && this.data[i]._enabled) {
          return this.data[i];
        }
      }
    }
    return null; // No matching item found
  }

  public getPrevious(id: string): DataManagerDataObject | null {
    const currentIndex = this.data.findIndex(item => item.id === id);
    if (currentIndex !== -1) {
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (this.data[i]._isCategoryPage && this.data[i]._enabled) {
          return this.data[i];
        }
      }
    }
    return null; // No matching item found
  }
}
