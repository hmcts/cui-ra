import fs from 'fs';
import { NewFlagsManager } from '../../../../main/managers';
import { DataManagerDataObject } from '../../../../main/interfaces';

const dataJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);
const dataManager: NewFlagsManager = new NewFlagsManager();
const itemId = 'RA0001-RA0004';
const nextId = 'RA0001-RA0004-RA0009';
const previousId = 'RA0001';

const testString = 'this is a test string';

/* eslint-disable jest/expect-expect */
describe('New Flags Manager', () => {
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
    const items: DataManagerDataObject[] = dataManager.find('name', 'Hearing provision');

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

  test('Get Child Elements', async () => {
    //This test will mock a form submission
    const childItems: DataManagerDataObject[] = dataManager.getChildren(itemId);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(childItems.length).toEqual(2);
  });

  test('Get Next Category Page', async () => {
    //We need to enable the items this mocks what the form does
    const enableNextFlag: DataManagerDataObject | null = dataManager.get(nextId);
    if (enableNextFlag) {
      enableNextFlag._enabled = true;
      dataManager.save([enableNextFlag]);
    }
    const next: DataManagerDataObject | null = dataManager.getNext(itemId);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(next?.id).toEqual(nextId);
  });

  test('Get Previous Category Page', async () => {
    //We need to enable the items this mocks what the form does
    const enablePreviousFlag: DataManagerDataObject | null = dataManager.get(previousId);
    if (enablePreviousFlag) {
      enablePreviousFlag._enabled = true;
      dataManager.save([enablePreviousFlag]);
    }
    const previous: DataManagerDataObject | null = dataManager.getPrevious(itemId);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(previous?.id).toEqual(previousId);
  });
});
