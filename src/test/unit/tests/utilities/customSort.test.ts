import { PayloadCollectionItem } from '../../../../main/interfaces';
import { CustomSort } from '../../../../main/utilities';
import { Request } from 'express';

describe('CustomSort', () => {
  describe('sortAlphabetically', () => {
    const item1 = {
      id: 'first item',
      value: {
        name: 'cat',
        name_cy: 'cat_cy',
        flagCode: 'CF0001',
      },
    } as PayloadCollectionItem;
    const item2 = {
      id: 'second item',
      value: {
        name: 'zebra',
        name_cy: 'zebra_cy',
        flagCode: 'CF0001',
      },
    } as PayloadCollectionItem;

    const item3 = {
      id: 'third item',
      value: {
        name: 'apple',
        name_cy: 'apple_cy',
        flagCode: 'CF0001',
      },
    } as PayloadCollectionItem;

    const item4 = {
      id: 'fourth item',
      value: {
        name: 'other',
        name_cy: 'other_cy',
        flagCode: 'OT0001',
      },
    } as PayloadCollectionItem;

    const item5 = {
      id: 'fifth item',
      value: {
        name: 'banana',
        name_cy: 'banana_cy',
        flagCode: 'CF0001',
      },
    } as PayloadCollectionItem;

    const items: PayloadCollectionItem[] = [item1, item2, item3, item4, item5];

    const mockRequest = (_welsh: boolean = false): Request => {
      return {
        session: {
          welsh: _welsh,
        },
      } as unknown as Request;
    };

    test('Should sort the data provided by name (english) putting other as last', () => {
      var sortedItems = CustomSort.alphabeticalAscOtherLast<PayloadCollectionItem>(items, mockRequest(false));
      const expectedOrder = ['apple', 'banana', 'cat', 'zebra', 'other'];
      const receivedOrder = sortedItems.map(item => item.value.name);
      expect(expectedOrder).toEqual(receivedOrder);
    });

    test('Should sort the data provided by name_cy (welsh) putting other as last', () => {
      var sortedItems = CustomSort.alphabeticalAscOtherLast<PayloadCollectionItem>(items, mockRequest(true));
      const expectedOrder = ['apple_cy', 'banana_cy', 'cat_cy', 'zebra_cy', 'other_cy'];
      const receivedOrder = sortedItems.map(item => item.value.name_cy);
      expect(expectedOrder).toEqual(receivedOrder);
    });

    test('Should sort the data provided by name (english)', () => {
      var sortedItems = CustomSort.alphabeticalAsc<PayloadCollectionItem>(items, mockRequest(true));
      const expectedOrder = ['apple', 'banana', 'cat', 'other', 'zebra'];
      const receivedOrder = sortedItems.map(item => item.value.name);
      expect(expectedOrder).toEqual(receivedOrder);
    });

    test('Should sort the data provided by name_cy (welsh)', () => {
      var sortedItems = CustomSort.alphabeticalAsc<PayloadCollectionItem>(items, mockRequest(true));
      const expectedOrder = ['apple_cy', 'banana_cy', 'cat_cy', 'other_cy', 'zebra_cy'];
      const receivedOrder = sortedItems.map(item => item.value.name_cy);
      expect(expectedOrder).toEqual(receivedOrder);
    });
  });
});
