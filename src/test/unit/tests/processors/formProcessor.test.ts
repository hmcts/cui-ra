import fs from 'fs';
import { DataManagerDataObject } from './../../../../main/interfaces';
import { FormProcessor } from './../../../../main/processors';
import { Form, FormData } from './../../../../main/models';
import { ErrorMessages } from './../../../../main/constants';

const dataProcessorResultJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);
const comment = 'Comment for child1';

describe('FormProcessor', () => {
  test('should process checkbox form data correctly', () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
    )[0];
    const children: DataManagerDataObject[] = dataProcessorResultJson.filter((item: DataManagerDataObject) =>
      parent._childIds.includes(item.id)
    );

    const body = new Form();
    const formdata = new FormData();
    formdata.flagComment = comment;

    body.enabled = ['PF0001-RA0001-RA0002-RA0010'];
    body.data = {
      'PF0001-RA0001-RA0002-RA0010': formdata,
    };

    const results: DataManagerDataObject[] = FormProcessor.process(body, parent, children);

    const item: DataManagerDataObject | undefined = results.find(
      (i: DataManagerDataObject) => i.id === 'PF0001-RA0001-RA0002-RA0010'
    );

    if (item) {
      expect(item._enabled).toBe(true);
      expect(item.value.flagComment).toBe(comment);
    }
  });

  test('should fail to process checkbox form data', () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-RA0001'
    )[0];
    const children: DataManagerDataObject[] = dataProcessorResultJson.filter((item: DataManagerDataObject) =>
      parent._childIds.includes(item.id)
    );

    const body = new Form();

    let error = '';

    try {
      FormProcessor.process(body, parent, children);
    } catch (e) {
      error = e.message;
    }

    expect(error).toBe(ErrorMessages.UNEXPECTED_ERROR);
  });

  test('should process typeahead form data correctly', () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-PF0015'
    )[0];
    const children: DataManagerDataObject[] = [];

    const body = new Form();

    body.selected = 'zul';

    const results: DataManagerDataObject[] = FormProcessor.process(body, parent, children);

    const item: DataManagerDataObject | undefined = results.find(
      (i: DataManagerDataObject) => i.id === 'PF0001-PF0015'
    );

    if (item) {
      expect(item._enabled).toBe(true);
      expect(item.value.subTypeValue).toBe('Zulu');
    }
  });

  test('should process radio-group form data correctly', () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'PF0001-PF1115'
    )[0];
    const children: DataManagerDataObject[] = [];

    const body = new Form();

    body.selected = 'abr';

    const results: DataManagerDataObject[] = FormProcessor.process(body, parent, children);

    const item: DataManagerDataObject | undefined = results.find(
      (i: DataManagerDataObject) => i.id === 'PF0001-PF1115'
    );

    if (item) {
      expect(item._enabled).toBe(true);
      expect(item.value.subTypeValue).toBe('Brong');
    }
  });
});
