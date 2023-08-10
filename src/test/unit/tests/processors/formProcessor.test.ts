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
      (item: DataManagerDataObject) => item.id === 'RA0001'
    )[0];
    const children: DataManagerDataObject[] = dataProcessorResultJson.filter((item: DataManagerDataObject) =>
      parent._childIds.includes(item.id)
    );

    const body = new Form();
    const formdata = new FormData();
    formdata.flagComment = comment;

    body.enabled = ['RA0001-RA0002'];
    body.data = {
      'RA0001-RA0002': formdata,
    };

    const results: DataManagerDataObject[] = FormProcessor.process(body, parent, children);

    const item: DataManagerDataObject | undefined = results.find(
      (i: DataManagerDataObject) => i.id === 'RA0001-RA0002'
    );

    if (item) {
      expect(item._enabled).toBe(true);
      expect(item.value.flagComment).toBe(comment);
    }
  });

  test('should fail to process checkbox form data', () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'RA0001'
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
      (item: DataManagerDataObject) => item.id === 'RA0001-RA0005-RA0010'
    )[0];
    const children: DataManagerDataObject[] = [];

    const body = new Form();

    body.selected = comment;

    const results: DataManagerDataObject[] = FormProcessor.process(body, parent, children);

    const item: DataManagerDataObject | undefined = results.find(
      (i: DataManagerDataObject) => i.id === 'RA0001-RA0005-RA0010'
    );

    if (item) {
      expect(item._enabled).toBe(true);
      expect(item.value.subTypeValue).toBe(comment);
    }
  });

  test('should fail to process typeahead form data', () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'RA0001-RA0005-RA0010'
    )[0];
    const children: DataManagerDataObject[] = [];

    const body = new Form();

    let error = '';

    try {
      FormProcessor.process(body, parent, children);
    } catch (e) {
      error = e.message;
    }

    expect(error).toBe(ErrorMessages.UNEXPECTED_ERROR);
  });

  test('should process radio-group form data correctly', () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'RA0001-RA0005-RA0016-RA0017'
    )[0];
    const children: DataManagerDataObject[] = [];

    const body = new Form();

    body.selected = comment;

    const results: DataManagerDataObject[] = FormProcessor.process(body, parent, children);

    const item: DataManagerDataObject | undefined = results.find(
      (i: DataManagerDataObject) => i.id === 'RA0001-RA0005-RA0016-RA0017'
    );

    if (item) {
      expect(item._enabled).toBe(true);
      expect(item.value.subTypeValue).toBe(comment);
    }
  });

  test('should fail to process typeahead form data', () => {
    const parent: DataManagerDataObject = dataProcessorResultJson.filter(
      (item: DataManagerDataObject) => item.id === 'RA0001-RA0005-RA0016-RA0017'
    )[0];
    const children: DataManagerDataObject[] = [];

    const body = new Form();

    let error = '';

    try {
      FormProcessor.process(body, parent, children);
    } catch (e) {
      error = e.message;
    }

    expect(error).toBe(ErrorMessages.UNEXPECTED_ERROR);
  });
});
