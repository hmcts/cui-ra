import { DataManagerDataObject, DataManager as DataManagerInterface, PayloadFlagData } from './../interfaces';

export enum DataManagerYesNo {
  Yes = 'Yes',
  No = 'No',
}

export class DataManagerDataType implements DataManagerDataObject {
  public id: string;
  public value: PayloadFlagData;

  public _flagComment = true;
  public _isCategoryPage = false;
  public _enabled = false;
  public _other = false;
  public _isParent = false;
  public _isMaster = false;

  public _parentId: string | null;
  public _errors: string[] = [];
  public _listOfValuesLength = 0;
  public _listOfValues: { key: string; value: string; value_cy: string | undefined }[] = [];
  public _childIds: string[] = [];

  constructor(id: string, value: PayloadFlagData, parentId: string | null = null) {
    this.id = id;
    this.value = value;
    this._parentId = parentId;
  }
}

export class DataManager<T> implements DataManagerInterface<T> {
  public data: T[] = [];
  public modified = false;

  public set(data: T[]): void {
    this.data = data;
  }

  public save(data: Partial<T>[]): void {
    //Map new partial data back to full collection

    data.forEach((load: Partial<T>) => {
      const dataItem = this.data.find(item => item['id'] === load['id']);
      if (!dataItem) {
        return;
      }
      //UPDATE MODIFIED INFORMATION
      dataItem['value']['dateTimeModified'] = this.getDateTime();
      Object.assign(dataItem, load);
    });
    this.modified = true;
  }

  public get(id: string): T | null {
    const item = this.data.find(i => i['id'] === id);
    if (item) {
      return item;
    }
    return null;
  }

  public find(key: string, value: string | boolean | number): T[] {
    return this.data.filter((item: T) => this.getObjectValueByDotKey(item, key) === value);
  }

  private getObjectValueByDotKey(item: T, key: string): T | undefined {
    const keys = key.split('.');
    let value = item;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    return value;
  }

  public getDateTime(): string {
    const now: Date = new Date();
    return `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
      .getFullYear()
      .toString()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now
      .getSeconds()
      .toString()
      .padStart(2, '0')}`;
  }
}
