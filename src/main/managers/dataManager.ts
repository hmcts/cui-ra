import {
  DataManagerDataObject,
  DataManager as DataManagerInterface,
  PayloadPath,
  ReferenceDataFlagType,
} from './../interfaces';

export enum DataManagerYesNo {
  Yes = 'Yes',
  No = 'No',
}

export class DataManagerDataType implements DataManagerDataObject {
  //required fields used for payload
  public name = '';
  public name_cy = '';
  public subTypeValue: string | undefined;
  public subTypeValue_cy: string | undefined;
  public subTypeKey: string | undefined;
  public otherDescription: string | undefined;
  public otherDescription_cy: string | undefined;
  public flagComment: string | undefined;
  public flagComment_cy: string | undefined;
  public flagUpdateComment: string | undefined;
  public dateTimeModified: string;
  public dateTimeCreated: string;
  public path: PayloadPath[] = [];
  public hearingRelevant: DataManagerYesNo = DataManagerYesNo.No;
  public flagCode: string;
  public status: string | undefined;
  public availableExternally: DataManagerYesNo = DataManagerYesNo.Yes;

  //required data from refdata
  public _flagComment = false;
  public _defaultStatus: string | undefined;
  public _isParent = false;
  public _listOfValuesLength = 0;
  public _listOfValues: { key: string; value: string }[] = [];

  //values used for system decisions
  public _isCategoryPage: boolean;
  public _saved = false;
  public _updated = false;
  public _enabled = false;
  public _parentFlagCode: string;
  public _errors: string[] = [];

  constructor(flag: ReferenceDataFlagType, parentFlagCode: string) {
    this.name = flag.name;
    this.name_cy = flag.name_cy;
    this.flagCode = flag.flagCode;
    this.status = flag.defaultStatus;

    //Map string[] to path object
    this.path = flag.Path.map(str => {
      return {
        id: undefined,
        name: str,
      };
    });

    //Set yes/no answers from booleans returns from flag ref
    this.hearingRelevant = flag.hearingRelevant ? DataManagerYesNo.Yes : DataManagerYesNo.No;
    this.availableExternally = flag.externallyAvailable ? DataManagerYesNo.Yes : DataManagerYesNo.No;

    //Set date time values
    const now: Date = new Date();
    const dateTime = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getFullYear().toString()} ${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    this.dateTimeCreated = dateTime;
    this.dateTimeModified = dateTime;

    //Map flag value that do not belong in the final payload with underscore
    this._flagComment = flag.flagComment;
    this._defaultStatus = flag.defaultStatus;
    this._isParent = flag.isParent;
    this._listOfValues = flag.listOfValues;
    this._listOfValuesLength = flag.listOfValuesLength;

    //Calculated mapping used for processing
    this._isCategoryPage = flag.isParent === true;
    this._parentFlagCode = parentFlagCode;
  }
}

export class DataManager implements DataManagerInterface {
  public data: DataManagerDataObject[] = [];

  // public set(): void {
  //     //this.data = data;
  // }

  // public init(): void {
  //     //this.data = data;
  // }

  // public merge(): void {
  //     //this.data = data;
  // }

  // public save(): void {
  //     //this.data = data;
  // }

  // public find(): void {
  //     //this.data = data;
  // }

  // public getChildren(): void {
  //     //this.data = data;
  // }

  // public getFlag(): void {
  //     //this.data = data;
  // }

  // public enable(): void {
  //     //this.data = data;
  // }

  // public disable(): void {
  //     //this.data = data;
  // }

  // public getNext(): void {
  //     //this.data = data;
  // }

  // public getPrevious(): void {
  //     //this.data = data;
  // }

  // public deleteNode(){
  //     //this.data = data;
  // }

  // public deleteNodeList(){
  //     //this.data = data;
  // }
}
