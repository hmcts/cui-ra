import fs from 'fs';
import { FormValidator } from '../../../../main/validators';
import { DataManagerDataObject } from '../../../../main/interfaces';

const dataProcessorResultJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/form-validator-results.json', 'utf-8')
);

describe('FormValidator', () => {
  const parent: DataManagerDataObject = dataProcessorResultJson.filter(
    (item: DataManagerDataObject) => item.id === 'PF0001-RA0001-RA0008-RA0042'
  )[0];

  const processedItems: DataManagerDataObject[] = dataProcessorResultJson.filter(
    (item: DataManagerDataObject) => item.id === 'PF0001-RA0001-RA0008-RA0042'
  );

  describe('Validate', () => {
    test('should fail on sign language interpreter auto complete list validation', async () => {
      parent.value.subTypeValue = '';

      const [validationErrors] = await FormValidator.validate(processedItems, parent);

      const keys = Object.keys(validationErrors);

      expect(keys).not.toHaveLength(0);
    });

    test('should pass on sign language interpreter auto complete list validation', async () => {
      parent.value.subTypeValue = 'test';

      const [validationErrors] = await FormValidator.validate(processedItems, parent);

      const keys = Object.keys(validationErrors);

      expect(keys).toHaveLength(0);
    });
  });
});
