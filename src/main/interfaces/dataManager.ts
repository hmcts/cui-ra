import { PayloadCollectionItem } from '.';

export interface DataManagerDataObject extends PayloadCollectionItem {
  _flagComment: boolean;
  _isCategoryPage: boolean;
  _enabled: boolean;
  _parentId: string | null;
  _isParent: boolean;
  _errors: string[];
  _listOfValuesLength: number;
  _listOfValues: { key: string; value: string }[];
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

  find(key: string, value: string): T[];

  getDateTime(): string;

  //getChildren(id:string): T[];

  //enable(id:string): void;

  //disable(id:string): void;

  //init(flags: ReferenceDataFlagType, includeParent: boolean): void;
  //getFlag(flagCode: string, parentCode: string | null): T | null;
  //getChildren(flagCode: string): T[];
  //enable(flagCode: string, parentCode: string | null): void;
  //disable(flagCode: string, parentCode: string | null, disableDependants: boolean): void;
  //find(key: string, value: string): T[];
  //getNext(currentFlagCode: string): T | null;
  //getPrevious(currentFlagCode: string): T | null;
}
