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

      expect(sortedItems[0].value.name).toBe('apple');
      expect(sortedItems[1].value.name).toBe('banana');
      expect(sortedItems[2].value.name).toBe('cat');
      expect(sortedItems[3].value.name).toBe('zebra');
      expect(sortedItems[4].value.name).toBe('other');
    });

    test('Should sort the data provided by name_cy (welsh) putting other as last', () => {
      var sortedItems = CustomSort.alphabeticalAscOtherLast<PayloadCollectionItem>(items, mockRequest(true));

      expect(sortedItems[0].value.name_cy).toBe('apple_cy');
      expect(sortedItems[1].value.name_cy).toBe('banana_cy');
      expect(sortedItems[2].value.name_cy).toBe('cat_cy');
      expect(sortedItems[3].value.name_cy).toBe('zebra_cy');
      expect(sortedItems[4].value.name_cy).toBe('other_cy');
    });

    test('Should sort the data provided by name (english)', () => {
      var sortedItems = CustomSort.alphabeticalAsc<PayloadCollectionItem>(items, mockRequest(true));

      expect(sortedItems[0].value.name_cy).toBe('apple_cy');
      expect(sortedItems[1].value.name_cy).toBe('banana_cy');
      expect(sortedItems[2].value.name_cy).toBe('cat_cy');
      expect(sortedItems[3].value.name_cy).toBe('other_cy');
      expect(sortedItems[4].value.name_cy).toBe('zebra_cy');
    });

    test('Should sort the data provided by name_cy (welsh)', () => {
      var sortedItems = CustomSort.alphabeticalAsc<PayloadCollectionItem>(items, mockRequest(true));

      expect(sortedItems[0].value.name_cy).toBe('apple_cy');
      expect(sortedItems[1].value.name_cy).toBe('banana_cy');
      expect(sortedItems[2].value.name_cy).toBe('cat_cy');
      expect(sortedItems[3].value.name_cy).toBe('other_cy');
      expect(sortedItems[4].value.name_cy).toBe('zebra_cy');
    });
  });
});
