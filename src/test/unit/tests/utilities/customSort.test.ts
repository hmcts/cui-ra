import { PayloadCollectionItem } from '../../../../main/interfaces';
import { CustomSort } from '../../../../main/utilities';
import { Request } from 'express';

describe('CustomSort', () => {
  describe('sortAlphabetically', () => {
    const items: PayloadCollectionItem[] = [
      {
        id: 'first item',
        value: {
          name: 'cat',
          name_cy: 'cat',
          subTypeValue: '',
          subTypeValue_cy: '',
          flagComment: '',
          flagComment_cy: '',
          flagUpdateComment: '',
          otherDescription: '',
          otherDescription_cy: '',
          subTypeKey: '',
          dateTimeModified: '12-07-2023 13:28:21',
          dateTimeCreated: '12-07-2023 13:28:21',
          path: [
            {
              id: '',
              name: '',
            },
          ],
          hearingRelevant: 'No',
          flagCode: 'CF0001',
          status: 'Active',
          availableExternally: 'No',
        },
      },
      {
        id: 'second item',
        value: {
          name: 'zebra',
          name_cy: 'zebra',
          subTypeValue: '',
          subTypeValue_cy: '',
          flagComment: '',
          flagComment_cy: '',
          flagUpdateComment: '',
          otherDescription: '',
          otherDescription_cy: '',
          subTypeKey: '',
          dateTimeModified: '12-07-2023 13:28:21',
          dateTimeCreated: '12-07-2023 13:28:21',
          path: [
            {
              id: '',
              name: '',
            },
          ],
          hearingRelevant: 'No',
          flagCode: 'CF0001',
          status: 'Active',
          availableExternally: 'No',
        },
      },
      {
        id: 'third item',
        value: {
          name: 'apple',
          name_cy: 'apple',
          subTypeValue: '',
          subTypeValue_cy: '',
          flagComment: '',
          flagComment_cy: '',
          flagUpdateComment: '',
          otherDescription: '',
          otherDescription_cy: '',
          subTypeKey: '',
          dateTimeModified: '12-07-2023 13:28:21',
          dateTimeCreated: '12-07-2023 13:28:21',
          path: [
            {
              id: '',
              name: '',
            },
          ],
          hearingRelevant: 'No',
          flagCode: 'CF0001',
          status: 'Active',
          availableExternally: 'No',
        },
      },
    ];

    const mockRequest = (_welsh: boolean = false): Request => {
      return {
        session: {
          welsh: _welsh,
        },
      } as unknown as Request;
    };

    test('Should sort the data provided by name (english)', () => {
      var sortedItems = CustomSort.alphabeticalAsc<PayloadCollectionItem>(items, mockRequest(false));

      expect(sortedItems[0].value.name).toBe('apple');
      expect(sortedItems[1].value.name).toBe('cat');
      expect(sortedItems[2].value.name).toBe('zebra');
    });

    test('Should sort the data provided by name_cy (welsh)', () => {
      var sortedItems = CustomSort.alphabeticalAsc<PayloadCollectionItem>(items, mockRequest(true));

      expect(sortedItems[0].value.name).toBe('apple');
      expect(sortedItems[1].value.name).toBe('cat');
      expect(sortedItems[2].value.name).toBe('zebra');
    });
  });
});
