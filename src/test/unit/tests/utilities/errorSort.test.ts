import { DataManagerDataObject } from '../../../../main/interfaces';
import { ErrorSort } from '../../../../main/utilities';

describe('ErrorSort', () => {
  test('should sort validation errors according to items', () => {
    // Mock data
    const items: DataManagerDataObject[] = [{ id: '1' }, { id: '2' }] as unknown as DataManagerDataObject[];

    const validationErrors = {
      error1_1: 'Error 1 for item 1',
      error1_2: 'Error 1 for item 2',
      error2_1: 'Error 2 for item 1',
      other_error: 'Other error not related to any item',
    };

    // Expected sorted errors
    const expectedSortedErrors = {
      error1_1: 'Error 1 for item 1',
      error2_1: 'Error 2 for item 1',
      error1_2: 'Error 1 for item 2',
      other_error: 'Other error not related to any item',
    };

    // Call the method under test
    const sortedErrors = ErrorSort.matchSorting(items, validationErrors);

    // Assertions
    expect(sortedErrors).toEqual(expectedSortedErrors);
  });

  test('should handle empty input', () => {
    // Empty items array
    const items: DataManagerDataObject[] = [];

    // Empty validationErrors object
    const validationErrors = {};

    // Call the method under test
    const sortedErrors = ErrorSort.matchSorting(items, validationErrors);

    // Expect the result to be an empty object
    expect(sortedErrors).toEqual({});
  });
});
