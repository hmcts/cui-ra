import { DataTimeUtilities } from '../../../../main/utilities';

describe('DataTimeUtilities', () => {
  describe('getDateTime', () => {
    test('should return the current date and time in the correct format', () => {
      // Create a fixed date to use for the test
      const fixedDate = new Date('2023-07-24T12:34:56');

      // Mock the Date object to return the fixed date for this test
      jest.spyOn(global, 'Date').mockImplementation(() => fixedDate as Date);

      // Expected output in the format 'DD-MM-YYYY HH:mm:ss'
      const expectedDateTime = '24-07-2023 12:34:56';

      // Call the getDateTime method
      const result = DataTimeUtilities.getDateTime();

      // Restore the original implementation of the Date object
      jest.restoreAllMocks();

      // Check if the result matches the expected output
      expect(result).toBe(expectedDateTime);
    });
  });
});
