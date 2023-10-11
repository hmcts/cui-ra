import fs from 'fs';
import { NewFlagsManager } from '../../../../main/managers';
import { DataManagerDataObject } from '../../../../main/interfaces';

const dataJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);
const dataManager: NewFlagsManager = new NewFlagsManager();
const RA_Parent = 'PF0001';
const RA_Id = 'PF0001-RA0001';
const itemId = 'PF0001-RA0001-RA0004';
const nextId = 'PF0001-RA0001-RA0005';
const previousId = RA_Id;

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
    const items: DataManagerDataObject[] = dataManager.find(
      'value.name',
      'I need adjustments to get to, into and around our buildings'
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

  test('Get Child Elements', async () => {
    //This test will mock a form submission
    const childItems: DataManagerDataObject[] = dataManager.getChildren(itemId);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(childItems.length).toEqual(8);
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

  test('Enable flag by ID', async () => {
    //enable RAId flag. this should also enable its parent
    dataManager.enable(itemId);

    const item: DataManagerDataObject | null = dataManager.get(itemId);

    const item_ra: DataManagerDataObject | null = dataManager.get(RA_Id);

    const item_ra_parent: DataManagerDataObject | null = dataManager.get(RA_Parent);

    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(item?._enabled).toEqual(true);
    expect(item_ra?._enabled).toEqual(true);
    expect(item_ra_parent?._enabled).toEqual(true);
  });

  test('Disable flag by ID - should disable all children and parent', async () => {
    //enable two children of RA
    dataManager.enable(itemId);
    dataManager.enable(nextId);

    dataManager.disable(RA_Id);

    const item_ra: DataManagerDataObject | null = dataManager.get(RA_Id);
    const item_ra_parent: DataManagerDataObject | null = dataManager.get(RA_Parent);
    const item: DataManagerDataObject | null = dataManager.get(itemId);
    const item_next: DataManagerDataObject | null = dataManager.get(nextId);

    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(item_ra?._enabled).toEqual(false);
    expect(item_ra_parent?._enabled).toEqual(false);
    expect(item?._enabled).toEqual(false);
    expect(item_next?._enabled).toEqual(false);
  });

  test('Disable flag by ID - should disable all children and should not disable parent', async () => {
    //enable two children of RA
    dataManager.enable(itemId);
    dataManager.enable(nextId);

    dataManager.disable(nextId);

    const item_ra: DataManagerDataObject | null = dataManager.get(RA_Id);
    const item_ra_parent: DataManagerDataObject | null = dataManager.get(RA_Parent);
    const item: DataManagerDataObject | null = dataManager.get(itemId);
    const item_next: DataManagerDataObject | null = dataManager.get(nextId);

    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(item_ra?._enabled).toEqual(true);
    expect(item_ra_parent?._enabled).toEqual(true);
    expect(item?._enabled).toEqual(true);
    expect(item_next?._enabled).toEqual(false);
  });

  test('get first', async () => {
    dataManager.disable(RA_Parent);
    dataManager.enable(RA_Id, false);

    const item: DataManagerDataObject | null = dataManager.getFirst();
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(item?.id).toEqual(RA_Id);
  });

  test('hasUnaswered - category expect true', async () => {
    //enable two children of RA
    dataManager.enable(RA_Id);
    dataManager.enable(itemId);
    const result = dataManager.hasUnaswered();
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(result).toEqual(true);
  });

  test('hasUnaswered - category expect false', async () => {
    //enable two children of RA
    dataManager.enable(RA_Id);
    dataManager.enable(itemId);
    dataManager.enable('PF0001-RA0001-RA0004-RA0019');
    const result = dataManager.hasUnaswered();
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(result).toEqual(false);
  });

  test('hasUnaswered - flagComment expect true', async () => {
    //enable two children of RA
    dataManager.enable(RA_Id);
    dataManager.enable(itemId);
    dataManager.enable('PF0001-RA0001-RA0004-RA0019');
    dataManager.enable('PF0001-RA0001-RA0004-RA0021');
    const result = dataManager.hasUnaswered();
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(result).toEqual(true);
  });

  test('hasUnaswered - flagComment expect false', async () => {
    //enable two children of RA
    dataManager.enable(RA_Id);
    dataManager.enable(itemId);
    dataManager.enable('PF0001-RA0001-RA0004-RA0019');
    dataManager.enable('PF0001-RA0001-RA0004-RA0021');

    const item: DataManagerDataObject | null = dataManager.get('PF0001-RA0001-RA0004-RA0021');
    if (item) {
      item.value.flagComment = 'test';
      dataManager.save([item]);
    }

    const result = dataManager.hasUnaswered();
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(result).toEqual(false);
  });

  test('hasUnaswered - listofitems expect true', async () => {
    //enable two children of RA
    dataManager.enable('PF0001-PF0015');

    const result = dataManager.hasUnaswered();
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(result).toEqual(true);
  });

  test('hasUnaswered - listofitems expect false', async () => {
    //enable two children of RA
    dataManager.enable('PF0001-PF0015');

    const item: DataManagerDataObject | null = dataManager.get('PF0001-PF0015');
    if (item) {
      item.value.subTypeValue = 'test';
      dataManager.save([item]);
    }

    const result = dataManager.hasUnaswered();
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(result).toEqual(false);
  });

  test('delete item by id', async () => {
    //enable two children of RA
    dataManager.delete('PF0001-PF0015');

    const item: DataManagerDataObject | null = dataManager.get('PF0001-PF0015');

    expect(item).toEqual(null);
  });

  test('delete item by a collection of ids', async () => {
    dataManager.set(dataJson);
    //enable two children of RA
    dataManager.deleteList(['PF0001-PF0015']);
    dataManager.deleteList(['PF0001-RA0001-RA0004-RA0019']);

    const itemOne: DataManagerDataObject | null = dataManager.get('PF0001-PF0015');
    const itemTwo: DataManagerDataObject | null = dataManager.get('PF0001-RA0001-RA0004-RA0019');

    expect(itemOne).toEqual(null);
    expect(itemTwo).toEqual(null);
  });

  test('find items ids from flagcode dot notations', async () => {
    dataManager.set(dataJson);
    //enable two children of RA
    const ids: string[] = dataManager.findIdsByFlagCodeDotNotation('RA0001.RA0004');

    expect(ids[0]).toEqual('PF0001-RA0001-RA0004');
  });

  test('delete item from flagcode dot notations', async () => {
    dataManager.set(dataJson);
    //enable two children of RA
    dataManager.deleteFlagCodeByDotKey('RA0001.RA0004');

    const item: DataManagerDataObject | null = dataManager.get('PF0001-RA0001-RA0004');

    expect(item).toEqual(null);
  });

  test('delete item from flagcode dot notations', async () => {
    dataManager.set(dataJson);
    //enable two children of RA
    dataManager.deleteFlagCodeByDotKey('PF0001.PF0015');
    dataManager.deleteFlagCodeByDotKey('RA0001.RA0004');

    const itemOne: DataManagerDataObject | null = dataManager.get('PF0001-PF0015');
    const itemTwo: DataManagerDataObject | null = dataManager.get('PF0001-RA0001-RA0004-RA0019');

    expect(itemOne).toEqual(null);
    expect(itemTwo).toEqual(null);
  });
});
