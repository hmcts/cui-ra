import fs from 'fs';
import { ExistingFlagProcessor } from '../../../../main/processors';
import { PayloadDataObject } from '../../../../main/interfaces';

const existingFlagJson = JSON.parse(fs.readFileSync(__dirname + '/../../data/flags-payload.json', 'utf-8'));

const dataProcessorResultJson: PayloadDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/existing-processor-results.json', 'utf-8')
);

const existingFlagProcessor = new ExistingFlagProcessor();

/* eslint-disable jest/expect-expect */
describe('Existing Flag Processor', () => {
  test('Should return a collection of PayloadDataObject', async () => {
    const data: PayloadDataObject[] = existingFlagProcessor.process(existingFlagJson);

    //console.log(JSON.stringify(data));
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(data).toEqual(dataProcessorResultJson);
  });
});
