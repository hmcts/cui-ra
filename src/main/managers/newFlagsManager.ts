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

  public getFirst(): DataManagerDataObject | null {
    const items: DataManagerDataObject[] = this.find('_enabled', true);
    if (items) {
      return items[0];
    }
    return null;
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

  //shallow check to be used by continue button.
  public hasUnaswered(): boolean {
    //get all enabled
    const enabled = this.data.filter((item: DataManagerDataObject) => item._enabled === true);
    for (let i = 0; i < enabled.length; i++) {
      const flag: DataManagerDataObject = enabled[i];
      if (flag?._isParent) {
        //check children
        const children: DataManagerDataObject[] = this.getChildren(flag.id);
        if (children.length === 0) {
          //return false;
          continue;
        }
        const answered: DataManagerDataObject[] = children.filter(
          (item: DataManagerDataObject) => item._enabled === true
        );
        if (answered.length === 0) {
          return true;
        }
      } else {
        if (flag._listOfValuesLength > 0) {
          if (!flag.value.subTypeValue && !flag.value.subTypeValue_cy) {
            return true;
          }
        } else {
          if (flag?._flagComment) {
            if (!flag?.value.flagComment && !flag?.value.flagComment_cy) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  public enable(id: string, enableParent = true): void {
    const item: DataManagerDataObject | null = this.get(id);
    if (!item) {
      return;
    }
    item._enabled = true;
    if (item._parentId && enableParent && !item._isMaster) {
      this.enable(item._parentId, enableParent);
    }
  }

  //Disable a flag and its route, but aslong as the route does not have other
  //enabled children flags
  public disable(id: string, disableDependants = true): void {
    const item: DataManagerDataObject | null = this.get(id);
    if (!item) {
      return;
    }

    //prevent master from being disabled
    if (item._isMaster) {
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

  public save(data: Partial<DataManagerDataObject>[]): void {
    //Map new partial data back to full collection
    super.save(data);

    data.forEach((load: Partial<DataManagerDataObject>) => {
      if (load._enabled !== true && load.id) {
        this.disable(load.id);
      } else if (load._enabled === true && load.id) {
        this.enable(load.id);
      }
    });
  }

  //Remove flags from data. This should only be used remove flags that a service does not need.
  public delete(id: string): DataManagerDataObject | null {
    const index = this.data.findIndex(node => node.id === id);
    if (index === -1) {
      return null;
    }

    //Get and delete node
    const deletedNode: DataManagerDataObject = this.data.splice(index, 1)[0];

    //Get children and delete them
    const ChildCount: DataManagerDataObject[] | null = this.getChildren(deletedNode.id);
    if (ChildCount) {
      ChildCount.forEach(node => {
        this.delete(node.id);
      });
    }

    if (deletedNode._parentId) {
      const parentIndex = this.data.findIndex(node => node.id === deletedNode._parentId);
      if (parentIndex !== -1) {
        const childIndex = this.data[parentIndex]?._childIds.findIndex(node => node === id);
        if (childIndex !== -1) {
          this.data[parentIndex]._childIds.splice(childIndex ?? 0, 1);
        }
      }
      //Delete parent node but only if this flag is its only child
      const ParentChildCount: number = this.getChildren(deletedNode._parentId).length;
      if (ParentChildCount === 1) {
        this.delete(deletedNode._parentId);
      }
    }
    return deletedNode;
  }

  //Remove flags from data using a list of flag ids
  public deleteList(ids: string[]): void {
    ids.forEach((id: string) => {
      this.delete(id);
    });
  }

  private searchItem(
    item: DataManagerDataObject,
    dotNotation: string,
    matchingIds: string[],
    dataCollection: DataManagerDataObject[]
  ) {
    const dotNotations = dotNotation.split('.');
    const currentDot = dotNotations.shift();
    if (currentDot === item.value.flagCode) {
      if (dotNotations.length === 0) {
        matchingIds.push(item.id);
      } else {
        const children = this.getChildren(item.id);
        if (children) {
          for (const child of children) {
            this.searchItem(child, dotNotations.join('.'), matchingIds, dataCollection);
          }
        }
      }
    }
  }

  public findIdsByFlagCodeDotNotation(dotNotation: string | undefined): string[] {
    if (!dotNotation) {
      return [];
    }
    const matchingIds: string[] = [];
    for (const item of this.data) {
      this.searchItem(item, dotNotation, matchingIds, this.data);
    }
    return matchingIds;
  }

  public deleteFlagCodeByDotKey(flagCodes: string): void {
    const ids = this.findIdsByFlagCodeDotNotation(flagCodes);
    this.deleteList(ids);
  }

  public deleteFlagCodeByDotKeyList(flagCodes: string[]): void {
    flagCodes.forEach((code: string) => {
      this.deleteFlagCodeByDotKey(code);
    });
  }

  public setMaster(flagCode: string): DataManagerDataObject | null {
    const items: DataManagerDataObject[] = this.find('value.flagCode', flagCode);
    if (items.length !== 0) {
      const currentIndex = this.data.findIndex(item => item.id === items[0].id);
      this.data[currentIndex]._isMaster = true;
      this.data[currentIndex]._enabled = true;
      return this.data[currentIndex];
    }
    return null;
  }
}
