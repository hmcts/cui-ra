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

  public enable(id: string): void {
    const item: DataManagerDataObject | null = this.get(id);
    if (!item) {
      return;
    }
    item._enabled = true;
    if (item._parentId) {
      this.enable(item._parentId);
    }
  }

  //Disable a flag and its route, but aslong as the route does not have other
  //enabled children flags
  public disable(id: string, disableDependants = true): void {
    const item: DataManagerDataObject | null = this.get(id);
    if (!item) {
      return;
    }

    //disable flag
    item._enabled = false;

    if (disableDependants) {
      //Get children and disable them
      const Children: DataManagerDataObject[] | null = this.getChildren(item.id);
      if (Children) {
        Children.forEach(node => {
          this.disable(node.id);
        });
      }
    }

    if (!item._parentId) {
      return;
    }

    //only disable a parent if this flag is its only Enabled Child
    const ParentChildCount: number = this.getChildren(item._parentId).filter(
      (node: DataManagerDataObject) => node._enabled === true
    ).length;
    if (ParentChildCount === 0) {
      this.disable(item._parentId, false);
    }
  }
}
