import fs from 'fs';
import { ExistingFlagsManager } from '../../../../main/managers';
import { PayloadCollectionItem } from '../../../../main/interfaces';

const dataJson: PayloadCollectionItem[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/flags-payload.json', 'utf-8')
);

const dataManager: ExistingFlagsManager = new ExistingFlagsManager();

const itemId = 'RA0001-RA0004';

const testString = 'this is a test string';
const status = 'inactive';

/* eslint-disable jest/expect-expect */
describe('Exisiting Flags Manager', () => {
  test('Set Data', async () => {
    dataManager.set(dataJson);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(dataManager.data.length).toEqual(dataJson.length);
  });

  test('Get Data Item', async () => {
    const item: PayloadCollectionItem | null = dataManager.get(itemId);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(item?.id).toEqual(itemId);
  });

  test('Find Data Items', async () => {
    const items: PayloadCollectionItem[] = dataManager.find('value.name', 'Hearing provision');

    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(items[0].id).toEqual(itemId);
  });

  test('Save Flag Comment', async () => {
    //This test will mock a form submission
    const initialItem: PayloadCollectionItem | null = dataManager.get(itemId);
    if (initialItem) {
      initialItem.value.flagComment = testString;
      dataManager.save([initialItem]);
    }
    const updatedItem: PayloadCollectionItem | null = dataManager.get(itemId);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(updatedItem?.value.flagComment).toEqual(testString);
    expect(updatedItem?.value.dateTimeModified).not.toEqual(updatedItem?.value.dateTimeCreated);
  });

  test('Set Flag Status', async () => {
    //We need to enable the items this mocks what the form does
    dataManager.setStatus(itemId, status);

    const changedFlag: PayloadCollectionItem | null = dataManager.get(itemId);

    expect(changedFlag?.value.status).toEqual(status);
    expect(changedFlag?.value.dateTimeModified).not.toEqual(changedFlag?.value.dateTimeCreated);
  });
});
