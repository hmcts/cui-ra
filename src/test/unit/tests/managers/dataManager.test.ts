import fs from 'fs';
import { DataManager } from '../../../../main/managers';
import { DataManagerDataObject } from '../../../../main/interfaces';

const dataJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);
const dataManager: DataManager<DataManagerDataObject> = new DataManager<DataManagerDataObject>();
const itemId = 'PF0001-RA0001-RA0008-RA0009';
const testString = 'this is a test string';

/* eslint-disable jest/expect-expect */
describe('Data Manager', () => {
  test('Set Data', async () => {
    dataManager.set(dataJson);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(dataManager.data.length).toEqual(dataJson.length);
  });

  test('Get Data Item', async () => {
    const item: DataManagerDataObject | null = dataManager.get(itemId);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(item?.id).toEqual(itemId);
  });

  test('Find Data Items', async () => {
    const items: DataManagerDataObject[] = dataManager.find(
      'value.name',
      'Hearing Enhancement System (Hearing/Induction Loop, Infrared Receiver)'
    );

    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(items[0].id).toEqual(itemId);
  });

  test('Save Flag Comment', async () => {
    //This test will mock a form submission
    const initialItem: DataManagerDataObject | null = dataManager.get(itemId);
    if (initialItem) {
      initialItem.value.flagComment = testString;
      dataManager.save([initialItem]);
    }
    const updatedItem: DataManagerDataObject | null = dataManager.get(itemId);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(updatedItem?.value.flagComment).toEqual(testString);
    expect(updatedItem?.value.dateTimeModified).not.toEqual(updatedItem?.value.dateTimeCreated);
  });
});
