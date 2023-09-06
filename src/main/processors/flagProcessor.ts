import { DataManagerDataObject, FlagProcessorInterface, PayloadFlagData, ReferenceDataFlagType } from '../interfaces';
import { DataManagerDataType, DataManagerYesNo } from '../managers';

import { RefDataResponse } from './../services';

export class FlagProcessor implements FlagProcessorInterface {
  public processAll(dateTime: string, response: RefDataResponse): DataManagerDataObject[] {
    let flagsData: DataManagerDataObject[] = [];
    //for each flag
    for (let i = 0; i < response.flags.length; i++) {
      const flagDetail = response.flags[i];
      if (!flagDetail.FlagDetails) {
        continue;
      }
      //for each flag detials
      for (let ii = 0; ii < flagDetail.FlagDetails?.length; ii++) {
        const flag = flagDetail.FlagDetails[ii];
        //process
        const processed: DataManagerDataObject[] = this.process(dateTime, flag);
        flagsData = [...flagsData, ...processed];
      }
    }
    return flagsData;
  }

  public process(
    dateTime: string,
    flag: ReferenceDataFlagType,
    parentId: string | null = null
  ): DataManagerDataObject[] {
    const data: DataManagerDataObject[] = [];

    //Concatinate the id (flagcode) with the parent id to create unique ids
    let id: string = flag.nativeFlagCode;
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
        flag.Path && flag.Path.length > 0
          ? flag.Path.map(str => {
              return {
                id: undefined,
                name: str,
              };
            })
          : [],
      hearingRelevant: flag.hearingRelevant ? DataManagerYesNo.Yes : DataManagerYesNo.No,
      flagCode: flag.nativeFlagCode,
      status: flag.defaultStatus,
      availableExternally: flag.externallyAvailable ? DataManagerYesNo.Yes : DataManagerYesNo.No,
    };

    const dataItem = new DataManagerDataType(id, payload, parentId);

    dataItem._listOfValues = flag.listOfValues;
    dataItem._listOfValuesLength = flag.listOfValuesLength;
    dataItem._parentId = parentId;
    dataItem._flagComment = flag.flagComment;

    if (flag.childFlags && flag.childFlags.length > 0) {
      dataItem._isCategoryPage = true;
      dataItem._isParent = true;
      //we dont want flag comment on parents
      dataItem._flagComment = false;

      //Populate child ids
      dataItem._childIds = flag.childFlags.map(child => {
        return `${id}-${child.nativeFlagCode}`;
      });
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
    }
    return data;
  }
}
