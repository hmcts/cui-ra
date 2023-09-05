import fs from 'fs';
import { FormValidator } from '../../../../main/validators';
import { DataManagerDataObject } from './../../../../main/interfaces';
import { Form } from './../../../../main/models';
import { plainToClass } from 'class-transformer';
import { Common } from './../../../../main/constants';

const dataProcessorResultJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);

describe('FormValidator', () => {
  const parent: DataManagerDataObject = dataProcessorResultJson.filter(
    (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
  )[0];
  const children: DataManagerDataObject[] = dataProcessorResultJson.filter((item: DataManagerDataObject) =>
    parent._childIds.includes(item.id)
  );

  const formModel = plainToClass(Form, {});

  describe('Validate Body', () => {
    test('Should fail body validation', async () => {
      const [isValid] = await FormValidator.validateBody(parent, formModel);

      expect(isValid).toBe(false);
    });
  });

  describe('Validate', () => {
    test('should fail checkbox validation', async () => {
      for (let i = 0; i < children.length; i++) {
        children[i].value.flagComment = '';
        if (children[i].value.flagCode === Common.OTHER_FLAG_CODE) {
          children[i].value.flagComment = '';
          children[i]._enabled = true;
        }
      }

      const [validationErrors] = await FormValidator.validate(children, parent);

      const keys = Object.keys(validationErrors);

      expect(keys).not.toHaveLength(0);
    });

    test('should pass checkbox validation', async () => {
      for (let i = 0; i < children.length; i++) {
        children[i].value.flagComment = '';
        if (children[i].value.flagCode === Common.OTHER_FLAG_CODE) {
          children[i].value.flagComment = 'test';
          children[i]._enabled = true;
        }
      }

      const [validationErrors, ,] = await FormValidator.validate(children, parent);

      const keys = Object.keys(validationErrors);

      expect(keys).toHaveLength(0);
    });
  });
});
