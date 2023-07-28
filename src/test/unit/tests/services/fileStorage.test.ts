import fs from 'fs';
import { mockLogger } from './../../mocks';
import { FileStorageClient } from './../../../../main/services';

// Mock logger implementation for testing
const mockedLogger = mockLogger();

describe('FileStorageClient', () => {
  let fileStorageClient: FileStorageClient;

  beforeEach(() => {
    fileStorageClient = new FileStorageClient(mockedLogger);
  });

  afterEach(() => {
    // Clean up any created files after each test
    const testFiles = ['test_key1.txt', 'test_key2.txt'];
    testFiles.forEach((file) => {
      const filePath = `${fileStorageClient['filePath']}/${file}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

 test('should create an instance of FileStorageClient', () => {
    expect(fileStorageClient).toBeInstanceOf(FileStorageClient);
  });

 test('should set and get data correctly', async () => {
    const key = 'test_key1';
    const value = 'test_value1';

    // Set data
    await fileStorageClient.set(key, value);

    // Get data
    const retrievedValue = await fileStorageClient.get(key);

    expect(retrievedValue).toBe(value);
  });

 test('should return null when data is not found', async () => {
    const key = 'test_key2';

    // Get data
    const retrievedValue = await fileStorageClient.get(key);

    expect(retrievedValue).toBeNull();
  });

 test('should check if data exists correctly', async () => {
    const key = 'test_key1';
    const value = 'test_value1';

    // Set data
    await fileStorageClient.set(key, value);

    // Check if data exists
    const exists = await fileStorageClient.exists(key);

    expect(exists).toBe(true);
  });

 test('should return false when data does not exist', async () => {
    const key = 'test_key2';

    // Check if data exists
    const exists = await fileStorageClient.exists(key);

    expect(exists).toBe(false);
  });

 test('should delete data correctly', async () => {
    const key = 'test_key1';
    const value = 'test_value1';

    // Set data
    await fileStorageClient.set(key, value);

    // Delete data
    const deleted = await fileStorageClient.delete(key);

    // Check if data was deleted
    const existsAfterDeletion = await fileStorageClient.exists(key);

    expect(deleted).toBe(true);
    expect(existsAfterDeletion).toBe(false);
  });

 test('should return false when trying to delete non-existing data', async () => {
    const key = 'test_key1';

    // Delete data
    const deleted = await fileStorageClient.delete(key);

    expect(deleted).toBe(false);
  });
});