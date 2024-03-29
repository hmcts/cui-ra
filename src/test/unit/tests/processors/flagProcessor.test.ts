import fs from 'fs';
import { FlagProcessor } from '../../../../main/processors';
import { DataManagerDataObject } from '../../../../main/interfaces';

const flagJson = JSON.parse(fs.readFileSync(__dirname + '/../../data/flags.json', 'utf-8'));
const dataProcessorResultJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);
const dataProcessorResultWelshJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results-welsh.json', 'utf-8')
);

const flagProcessor = new FlagProcessor();

/* eslint-disable jest/expect-expect */
describe('Flag Processor', () => {
  test('Should return a collection of DataManagerDateObject', async () => {
    const dateTime = '12-07-2023 13:28:21';
    const data: DataManagerDataObject[] = flagProcessor.processAll(dateTime, flagJson, false);

    //console.log(JSON.stringify(data));
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(data).toEqual(dataProcessorResultJson);
  });

  test('Should return a collection of DataManagerDateObject but sorted for welsh', async () => {
    const dateTime = '12-07-2023 13:28:21';
    const data: DataManagerDataObject[] = flagProcessor.processAll(dateTime, flagJson, true);

    //console.log(JSON.stringify(data));
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(data).toEqual(dataProcessorResultWelshJson);
  });
});
