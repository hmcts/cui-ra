import fs from 'fs';
import { mockRequest } from '../../mocks';
import { ExistingFlagsManager, NewFlagsManager } from '../../../../main/managers';
import { DataManagerDataObject, PayloadCollectionItem } from './../../../../main/interfaces';
import { PayloadBuilder } from './../../../../main/builders';
import { OutboundPayload } from './../../../../main/models';
import { Actions, Status } from './../../../../main/constants';
import { ExistingFlagProcessor } from './../../../../main/processors';

const dataProcessorResultJson: DataManagerDataObject[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/data-processor-results.json', 'utf-8')
);

const payloadJson: PayloadCollectionItem[] = JSON.parse(
  fs.readFileSync(__dirname + '/../../data/flags-payload.json', 'utf-8')
);

//const outboundJson: OutboundPayload = JSON.parse(
//    fs.readFileSync(__dirname + '/../../data/outbound-payload.json', 'utf-8')
//);

/* eslint-disable jest/expect-expect */
describe('PayloadBuilder', () => {
  let existingManager: ExistingFlagsManager;
  let newManager: NewFlagsManager;
  let mockedRequest = mockRequest(null);
  const eprocessor = new ExistingFlagProcessor();
  const processed = eprocessor.process(payloadJson);

  beforeEach(() => {
    newManager = new NewFlagsManager();
    newManager.set(dataProcessorResultJson);

    existingManager = new ExistingFlagsManager();
    existingManager.set(processed);

    const mockSession = {
      partyname: 'john doe',
      roleoncase: 'owner',
      newmanager: newManager,
      existingmanager: existingManager,
    };

    mockedRequest.session = mockSession;
  });

  test('should generate payload both new and existing should be empty', async () => {
    const results: OutboundPayload = PayloadBuilder.build(mockedRequest);

    expect(results.flagsAsSupplied?.details).toHaveLength(0);
    expect(results.replacementFlags?.details).toHaveLength(0);
    expect(results.action).toBe(Actions.SUBMIT);
  });

  test('should generate payload both new and existing should not be empty', async () => {
    mockedRequest.session.existingmanager?.setStatus('RA0001-RA0004-RA0009-OT0001', Status.INACTIVE);

    const item: DataManagerDataObject | null = mockedRequest.session.newmanager.get('PF0001-RA0001-RA0002-RA0014');
    if (item) {
      item._enabled = true;
      mockedRequest.session.newmanager.save([item]);
    }

    const results: OutboundPayload = PayloadBuilder.build(mockedRequest);

    expect(results.flagsAsSupplied?.details).not.toHaveLength(0);
    expect(results.replacementFlags?.details).not.toHaveLength(0);
    expect(results.action).toBe(Actions.SUBMIT);
  });

  test('should generate payload replacementFlags should not be empty', async () => {
    mockedRequest.session.existingmanager.set([]);

    const item: DataManagerDataObject | null = mockedRequest.session.newmanager.get('PF0001-RA0001-RA0002-RA0014');
    if (item) {
      item._enabled = true;
      mockedRequest.session.newmanager.save([item]);
    }

    const results: OutboundPayload = PayloadBuilder.build(mockedRequest);

    expect(results.flagsAsSupplied?.details).toHaveLength(0);
    expect(results.replacementFlags?.details).not.toHaveLength(0);
    expect(results.action).toBe(Actions.SUBMIT);
  });

  test('should generate payload and check', async () => {
    mockedRequest.session.existingmanager?.setStatus('RA0001-RA0004-RA0009-OT0001', Status.INACTIVE);

    const item: DataManagerDataObject | null = mockedRequest.session.newmanager.get('PF0001-RA0001-RA0002-RA0014');
    if (item) {
      item._enabled = true;
      mockedRequest.session.newmanager.save([item]);
    }

    const results: OutboundPayload = PayloadBuilder.build(mockedRequest);

    expect(results.flagsAsSupplied?.details).not.toHaveLength(0);
    expect(results.replacementFlags?.details).not.toHaveLength(0);
    expect(results.action).toBe(Actions.SUBMIT);
  });

  test('should not generate payload, both new and existing should be empty', async () => {
    mockedRequest.session.existingmanager?.setStatus('RA0001-RA0004-RA0009-OT0001', Status.INACTIVE);

    const results: OutboundPayload = PayloadBuilder.build(mockedRequest, Actions.CANCEL);

    expect(results.flagsAsSupplied?.details).toHaveLength(0);
    expect(results.replacementFlags?.details).toHaveLength(0);
    expect(results.action).toBe(Actions.CANCEL);
  });
});
