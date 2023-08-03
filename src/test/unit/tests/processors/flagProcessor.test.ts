import fs from 'fs';
import { FlagProcessor } from '../../../../main/processors';
import { DataManagerDataObject } from '../../../../main/interfaces';

const flagJson = JSON.parse(fs.readFileSync(__dirname + '/../../data/flags.json', 'utf-8'));
const dataProcessorResultJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);

const flagProcessor = new FlagProcessor();

/* eslint-disable jest/expect-expect */
describe('Flag Processor', () => {
  test('Should return a collection of DataManagerDateObject', async () => {
    const dateTime = '12-07-2023 13:28:21';
    const data: DataManagerDataObject[] = flagProcessor.process(dateTime, flagJson.flags[0].FlagDetails);
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(data).toEqual(dataProcessorResultJson);
  });
});
