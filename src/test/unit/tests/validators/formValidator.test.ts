import fs from 'fs';
import { FormValidator } from '../../../../main/validators';
import { DataManagerDataObject } from './../../../../main/interfaces';
import { Form } from './../../../../main/models';
import { plainToClass } from 'class-transformer';

const dataProcessorResultJson: DataManagerDataObject[] = JSON.parse(
    fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);

describe('FormValidator', () => {

  const parent: DataManagerDataObject = dataProcessorResultJson.filter(
    (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
  )[0];

  const formModel = plainToClass(Form, {});

  describe('Validate Body', () => {
    test('Should fail body validation', async () => {
      const [isValid] = await FormValidator.validateBody(parent, formModel);

      expect(isValid).toBe(false);
    });
  });

  /* describe('Validate', () => {
    test('should generate the correct URL based on the Request object', () => {
      const mockRequest = {
        protocol: 'https',
        headers: {
          host: 'example.com',
        },
      } as unknown as Request;

      const expectedUrl = 'https://example.com';
      const result = UrlRoute.url(mockRequest);

      expect(result).toBe(expectedUrl);
    });
  }); */
});
