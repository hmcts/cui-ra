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
    //check body has data

    if (parent?._listOfValuesLength && parent?._listOfValuesLength > 0 && parent?._listOfValuesLength < 10) {
      //radio
      if (!body.selected) {
        throw new Error(ErrorMessages.UNEXPECTED_ERROR);
      }
      return [];
    } else if (parent?._listOfValuesLength && parent?._listOfValuesLength >= 10) {
      //typeahead
      if (!body.selected) {
        throw new Error(ErrorMessages.UNEXPECTED_ERROR);
      }
      return [];
    } else if (parent?._isCategoryPage) {
      //checkbox
      if (body.enabled && body.enabled.length <= 0) {
        throw new Error(ErrorMessages.UNEXPECTED_ERROR);
      }
      if (!body.data) {
        throw new Error(ErrorMessages.UNEXPECTED_ERROR);
      }
      //loop possible options and enable or disable
      //if enabled merge data
      //SECURITY NOTE - make sure only flagComment can get set/
      //Changing the html element name for example would merge to the wrong item and could
      //allow a user to change the status of a requested item
      children?.map(function (item: DataManagerDataObject) {
        item._errors = [];
        if (body.enabled.includes(item.id)) {
          item._enabled = true;
          //merge data
          if (body.data && body.data[item.id]) {
            Object.assign(item.value, body.data[item.id]);
          }
          return item;
        } else {
          item._enabled = false;
          Object.assign(item.value, {
            flagComment: '',
            flagComment_cy: '',
          });
          return item;
        }
      });
      return children || [];
    } else {
      throw new Error(ErrorMessages.UNEXPECTED_ERROR);
    }
  }
}
