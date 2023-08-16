import { PayloadCollectionItem } from '.';

export interface DataManagerDataObject extends PayloadCollectionItem {
  _flagComment: boolean;
  _isCategoryPage: boolean;
  _enabled: boolean;
  _other: boolean;
  _parentId: string | null;
  _isParent: boolean;
  _errors: string[];
  _listOfValuesLength: number;
  _listOfValues: { key: string; value: string; value_cy: string|undefined }[];
  _childIds: string[];
}

export interface DataManager<T> {
  data: T[];
  modified: boolean;
  //Set the data to the manager
  set(data: T[]): void;
  //Save partial data into the manager
  save(data: Partial<T>[]): void;
  get(id: string): T | null;
  find(key: string, value: string | boolean | number): T[];
  getDateTime(): string;
}
