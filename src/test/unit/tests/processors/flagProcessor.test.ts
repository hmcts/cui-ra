import fs from 'fs';
import { FlagProcessor } from '../../../../main/processors';
import { DataManagerDataObject, ReferenceDataFlagType } from '../../../../main/interfaces';

const flagJson = JSON.parse(fs.readFileSync(__dirname + '/../../data/flags.json', 'utf-8'));
const dataProcessorResultJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);
const dataProcessorResultWelshJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results-welsh.json', 'utf-8')
);

const flagProcessor = new FlagProcessor();

const normalise = (data: DataManagerDataObject[]): DataManagerDataObject[] =>
  [...data]
    .map(item => ({ ...item, _childIds: [...item._childIds].sort() }))
    .sort((first, second) => first.id.localeCompare(second.id));

const getFlagIds = (flags: ReferenceDataFlagType[], parentId = ''): string[] =>
  flags.flatMap(flag => {
    const id = parentId ? `${parentId}-${flag.nativeFlagCode}` : flag.nativeFlagCode;
    return [id, ...getFlagIds(flag.childFlags ?? [], id)];
  });

const expectedFlagOrder = flagJson.flags.flatMap((flagGroup: { FlagDetails: ReferenceDataFlagType[] }) =>
  getFlagIds(flagGroup.FlagDetails)
);

/* eslint-disable jest/expect-expect */
describe('Flag Processor', () => {
  test('Should return a collection of DataManagerDateObject', async () => {
    const dateTime = '12-07-2023 13:28:21';
    const data: DataManagerDataObject[] = flagProcessor.processAll(dateTime, flagJson, false);

    //console.log(JSON.stringify(data));
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(data.map(item => item.id)).toEqual(expectedFlagOrder);
    expect(normalise(JSON.parse(JSON.stringify(data)))).toEqual(normalise(dataProcessorResultJson));
  });

  test('Should return a collection of DataManagerDateObject but sorted for welsh', async () => {
    const dateTime = '12-07-2023 13:28:21';
    const data: DataManagerDataObject[] = flagProcessor.processAll(dateTime, flagJson, true);

    //console.log(JSON.stringify(data));
    // eslint-disable-line @typescript-eslint/no-empty-function
    expect(data.map(item => item.id)).toEqual(expectedFlagOrder);
    expect(normalise(JSON.parse(JSON.stringify(data)))).toEqual(normalise(dataProcessorResultWelshJson));
  });
});
