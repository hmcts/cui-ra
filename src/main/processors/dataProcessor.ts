import { PayloadFlagData, ReferenceDataFlagType } from './../interfaces';
import { DataManagerDataType, DataManagerYesNo } from './../managers';

export class DataProcessor {
  private static generateOther(flag: ReferenceDataFlagType) {
    const path = flag.Path;
    path.push(flag.name);
    return {
      name: 'Other',
      name_cy: 'Arall',
      hearingRelevant: true,
      flagComment: true,
      flagCode: 'OT0001',
      defaultStatus: 'Requested',
      externallyAvailable: true,
      isParent: false,
      Path: path,
      childFlags: [],
      listOfValues: [],
      listOfValuesLength: 0,
    } as ReferenceDataFlagType;
  }

  public static process(
    dateTime: string,
    flag: ReferenceDataFlagType,
    parentId: string | null = null
  ): DataManagerDataType[] {
    const data: DataManagerDataType[] = [];

    //Concatinate the id (flagcode) with the parent id to create unique ids
    let id: string = flag.flagCode;
    if (parentId) {
      id = `${parentId}-${id}`;
    }

    //Create flagdata payload maybe move this to use an automapper
    const payload: PayloadFlagData = {
      name: flag.name,
      name_cy: flag.name_cy,
      subTypeValue: undefined,
      subTypeValue_cy: undefined,
      subTypeKey: undefined,
      otherDescription: undefined,
      otherDescription_cy: undefined,
      flagComment: undefined,
      flagComment_cy: undefined,
      flagUpdateComment: undefined,
      dateTimeModified: dateTime,
      dateTimeCreated: dateTime,
      path:
        flag.Path.length > 0
          ? flag.Path.map(str => {
              return {
                id: undefined,
                name: str,
              };
            })
          : [],
      hearingRelevant: flag.hearingRelevant ? DataManagerYesNo.Yes : DataManagerYesNo.No,
      flagCode: flag.flagCode,
      status: flag.defaultStatus,
      availableExternally: flag.externallyAvailable ? DataManagerYesNo.Yes : DataManagerYesNo.No,
    };

    const dataItem = new DataManagerDataType(id, payload, parentId);

    dataItem._listOfValues = flag.listOfValues;
    dataItem._listOfValuesLength = flag.listOfValuesLength;
    dataItem._parentId = parentId;

    if (flag.childFlags && flag.childFlags.length > 0) {
      dataItem._isCategoryPage = true;
      dataItem._isParent = true;

      //Populate child ids
      dataItem._childIds = flag.childFlags.map(child => {
        return `${id}-${child.flagCode}`;
      });
      dataItem._childIds.push(`${id}-OT0001`);
    }

    if (flag.listOfValuesLength > 0) {
      dataItem._isCategoryPage = true;
    }

    //Add new item to collection
    data.push(dataItem);

    //loop and add children
    if (flag.childFlags && flag.childFlags.length > 0) {
      flag.childFlags.forEach((child: ReferenceDataFlagType) => {
        data.push(...this.process(dateTime, child, id));
      });
      //add other item
      data.push(...this.process(dateTime, this.generateOther(flag), id));
    }
    return data;
  }
}
