import fs from 'fs';
import { DataProcessor } from '../../../../main/processors';
import { DataManagerDataObject } from '../../../../main/interfaces';

const flagJson = JSON.parse(fs.readFileSync(__dirname + '/../../data/flags.json', 'utf-8'));
const dataProcessorResultJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);

/* eslint-disable jest/expect-expect */
describe('Data Processor', () => {
  test('Should return a collection of DataManagerDateObject', async () => {
    const dateTime = '12-07-2023 13:28:21';
    const data: DataManagerDataObject[] = DataProcessor.process(dateTime, flagJson.flags[0].FlagDetails);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(data).toEqual(dataProcessorResultJson);
  });
});
