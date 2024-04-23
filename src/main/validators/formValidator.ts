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

export interface ValidationErrors {
  [key: string]: string;
}

//validate form data
export class FormValidator {
  private static ajv: Ajv;

  static initialize(): void {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
    addErrors(this.ajv);
  }

  static async validate(
    processedItems: DataManagerDataObject[],
    parent: DataManagerDataObject
  ): Promise<[ValidationErrors, DataManagerDataObject, DataManagerDataObject[] | null]> {
    this.initialize();

    const [schema, type] = this.getSchema(parent);
    const validate = this.ajv.compile(schema);
    const validationErrors: ValidationErrors = {};

    for (const item of processedItems) {
      item._errors = [];
      const key = this.getKey(item, parent);
      const isValid = await validate(item);

      if (!isValid) {
        const errors = await validate.errors;
        if (errors && errors[0] && errors[0].message) {
          const message = `${key}.${errors[0].message}`;
          this.handleValidationErrors(item, message, validationErrors);
        }
      }
    }

    return type === parentType.parent
      ? [validationErrors, processedItems[0], null]
      : [validationErrors, parent, processedItems];
  }

  private static getKey(item: DataManagerDataObject, parent: DataManagerDataObject): string {
    if (item.value.flagCode === Common.OTHER_FLAG_CODE) {
      return `${parent.value.flagCode}.${Common.OTHER_FLAG_CODE}.error`;
    }
    return `${item.value.flagCode}.error`;
  }

  private static handleValidationErrors(
    item: DataManagerDataObject,
    message: string,
    validationErrors: ValidationErrors
  ): void {
    if (item._flagComment) {
      validationErrors[`flagComment-${item.id}`] = message;
    } else if (
      item._listOfValuesLength > 0 &&
      item._listOfValuesLength >= JSON.parse(config.get('radio.listOfValuesLength')) &&
      !item._other
    ) {
      validationErrors['custom-accessible-autocomplete'] = message;
    } else if (
      item._listOfValuesLength > 0 &&
      item._listOfValuesLength >= JSON.parse(config.get('radio.listOfValuesLength')) &&
      item._other
    ) {
      validationErrors['other'] = message;
    } else if (
      item._listOfValuesLength > 0 &&
      item._listOfValuesLength < JSON.parse(config.get('radio.listOfValuesLength')) &&
      item._other
    ) {
      validationErrors['other-text-area'] = message;
    } else {
      validationErrors[item.id] = message;
    }
  }

  private static getSchema(parent: DataManagerDataObject): [SchemaType, parentType] {
    const listOfValuesLength = JSON.parse(config.get('radio.listOfValuesLength'));
    if (parent._listOfValuesLength > 0 && parent._listOfValuesLength < listOfValuesLength) {
      return [radioSchema(), parentType.parent];
    } else if (parent._listOfValuesLength > 0 && parent._listOfValuesLength >= listOfValuesLength) {
      return [typeaheadSchema(), parentType.parent];
    } else if (parent._isCategoryPage) {
      return [checkboxSchema(), parentType.child];
    } else {
      throw new Error(ErrorMessages.UNEXPECTED_ERROR);
    }
  }

  static async validateBody(flag: DataManagerDataObject, form: Form): Promise<[boolean, ValidationErrors]> {
    this.initialize();
    const schema = formData();
    const validate = this.ajv.compile(schema);
    const validationErrors: ValidationErrors = {};
    const key = `${flag.value.flagCode}.error`;

    const isValid = await validate(form);

    if (!isValid) {
      const errors = await validate.errors;
      if (errors && errors[0] && errors[0].message) {
        const message = `${key}.${errors[0].message}`;
        this.handleBodyValidationErrors(flag, message, validationErrors);
      }
    }

    return [isValid, validationErrors];
  }

  private static handleBodyValidationErrors(
    flag: DataManagerDataObject,
    message: string,
    validationErrors: ValidationErrors
  ): void {
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
