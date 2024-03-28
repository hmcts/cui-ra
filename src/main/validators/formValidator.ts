import { Common, ErrorMessages } from './../constants';
import { DataManagerDataObject } from './../interfaces';
import { Form } from './../models';
import { checkboxSchema, formData, radioSchema, typeaheadSchema } from './../schemas';

import Ajv from 'ajv';
import addErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import config from 'config';
import { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';

export type SchemaType = JSONSchema4 | JSONSchema6 | JSONSchema7;

export enum parentType {
  parent = 'parent',
  child = 'child',
}

//validate form data
export class FormValidator {
  public static async validate(
    processedItems: DataManagerDataObject[],
    parent: DataManagerDataObject
  ): Promise<[{ [key: string]: string }, DataManagerDataObject, DataManagerDataObject[] | null]> {
    const ajv: Ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    addErrors(ajv);
    const listOfValuesLength = JSON.parse(config.get('radio.listOfValuesLength'));

    const [schema, type] = this.getSchema(parent);

    const validate = ajv.compile(schema);

    const validationErrors: { [key: string]: string } = {};

    for (let i = 0; i < processedItems.length; i++) {
      const item: DataManagerDataObject = processedItems[i];
      //clear errors
      item._errors = [];
      let key = `${item.value.flagCode}.error`;
      if (item.value.flagCode === Common.OTHER_FLAG_CODE) {
        key = `${parent.value.flagCode}.${Common.OTHER_FLAG_CODE}.error`;
      }
      const isValid = await validate(item);
      if (!isValid) {
        const errors = await validate.errors;
        if (errors && errors[0] && errors[0].message) {
          const message = `${key}.${errors[0].message}`;
          item._errors.push(message);
          if (item._flagComment) {
            validationErrors[`flagComment-${item.id}`] = message;
          } else if (item._listOfValuesLength > 0 && item._listOfValuesLength >= listOfValuesLength && !item._other) {
            validationErrors['custom-accessible-autocomplete'] = message;
          } else if (item._listOfValuesLength > 0 && item._listOfValuesLength >= listOfValuesLength && item._other) {
            validationErrors['other'] = message;
          } else if (item._listOfValuesLength > 0 && item._listOfValuesLength < listOfValuesLength && item._other) {
            validationErrors['other-text-area'] = message;
          } else {
            validationErrors[item.id] = message;
          }
        }
        processedItems[i] = item;
      }
    }

    if (type === parentType.parent) {
      return [validationErrors, processedItems[0], null];
    } else {
      return [validationErrors, parent, processedItems];
    }
  }

  private static getSchema(parent: DataManagerDataObject): SchemaType {
    const listOfValuesLength = JSON.parse(config.get('radio.listOfValuesLength'));
    if (parent._listOfValuesLength > 0 && parent._listOfValuesLength < listOfValuesLength) {
      //radio
      return [radioSchema(), parentType.parent];
    } else if (parent._listOfValuesLength > 0 && parent._listOfValuesLength >= listOfValuesLength) {
      //type ahead
      return [typeaheadSchema(), parentType.parent];
    } else if (parent._isCategoryPage) {
      //checkbox
      return [checkboxSchema(), parentType.child];
    } else {
      throw new Error(ErrorMessages.UNEXPECTED_ERROR);
    }
  }

  public static async validateBody(
    flag: DataManagerDataObject,
    form: Form
  ): Promise<[boolean, { [key: string]: string }]> {
    const ajv: Ajv = new Ajv({ allErrors: true });
    addFormats(ajv);
    addErrors(ajv);

    const schema = formData();

    const validate = ajv.compile(schema);

    const validationErrors: { [key: string]: string } = {};

    const key = `${flag.value.flagCode}.error`;

    const isValid = await validate(form);

    if (!isValid) {
      const errors = await validate.errors;
      if (errors && errors[0] && errors[0].message) {
        const message = `${key}.${errors[0].message}`;
        if (flag._isParent) {
          validationErrors[`_enabled-${flag._childIds[0]}`] = message;
        } else if (
          flag._listOfValuesLength > 0 &&
          flag._listOfValuesLength < JSON.parse(config.get('radio.listOfValuesLength'))
        ) {
          validationErrors[`_enabled-${flag._listOfValues[0].key}`] = message;
        } else {
          validationErrors[flag.id] = message;
        }
      }
    }

    return [isValid, validationErrors];
  }
}
