import { ErrorMessages } from './../constants';
import { DataManagerDataObject } from './../interfaces';
import { Form } from './../models';
//process the form data
export class FormProcessor {
  public static process(
    body: Form,
    parent: DataManagerDataObject,
    children: DataManagerDataObject[] | null = null
  ): DataManagerDataObject[] {
    if (parent._listOfValuesLength) {
      return this.processListValues(body, parent);
    }

    if (parent._isCategoryPage) {
      return this.processCategoryPage(body, parent, children);
    }

    throw new Error(ErrorMessages.UNEXPECTED_ERROR);
  }

  private static processCategoryPage(
    body: Form,
    parent: DataManagerDataObject,
    children: DataManagerDataObject[] | null
  ): DataManagerDataObject[] {
    if (!body.enabled || !body.data) {
      throw new Error(ErrorMessages.UNEXPECTED_ERROR);
    }

    return (
      children?.map(item => {
        item._errors = [];
        item._enabled = body.enabled.includes(item.id);

        if (item._enabled && body.data && body.data[item.id]) {
          item.value.flagComment = body.data[item.id].flagComment;
          item.value.flagComment_cy = body.data[item.id].flagComment_cy;
        } else {
          Object.assign(item.value, {
            flagComment: '',
            flagComment_cy: '',
          });
        }

        return item;
      }) ?? []
    );
  }

  private static processListValues(body: Form, parent: DataManagerDataObject): DataManagerDataObject[] {
    const isRadioType = parent._listOfValuesLength > 0 && parent._listOfValuesLength < 10;

    parent._enabled = true;
    parent.value.subTypeKey = undefined;
    parent.value.subTypeValue = undefined;
    parent.value.subTypeValue_cy = undefined;

    if (isRadioType) {
      return this.processRadioType(body, parent);
    }

    return this.processTypeAheadType(body, parent);
  }

  private static processRadioType(body: Form, parent: DataManagerDataObject): DataManagerDataObject[] {
    if (!body.selected) {
      throw new Error(ErrorMessages.UNEXPECTED_ERROR);
    }

    if (body.selected === 'OT0001') {
      parent._other = true;
      if (body.data) {
        parent.value.subTypeValue = body.data[parent.id].subTypeValue;
        parent.value.subTypeValue_cy = body.data[parent.id].subTypeValue_cy;
      }
      return [parent];
    }

    const selectedItem = parent._listOfValues.find(item => item.key === body.selected);

    if (selectedItem) {
      parent.value.subTypeKey = selectedItem.key;
      parent.value.subTypeValue = selectedItem.value;
      parent.value.subTypeValue_cy = selectedItem.value_cy;
    }

    return [parent];
  }

  private static processTypeAheadType(body: Form, parent: DataManagerDataObject): DataManagerDataObject[] {
    if (!body.selected) {
      return [parent];
    }

    const selectedItem = parent._listOfValues.find(item => item.key === body.selected);

    if (selectedItem) {
      parent.value.subTypeKey = selectedItem.key;
      parent.value.subTypeValue = selectedItem.value;
      parent.value.subTypeValue_cy = selectedItem.value_cy;
    }

    return [parent];
  }
}
