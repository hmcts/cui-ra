import {
  PayloadCollectionItem,
  PayloadDetail,
  PayloadFlagData,
  PayloadInbound,
  PayloadPath,
  PayloadYesNo,
} from './../interfaces';

export class InboundPayloadStore {
  idamToken: string;
  serviceToken: string;
  payload: InboundPayload;
  constructor(idamToken: string, serviceToken: string, payload: InboundPayload) {
    this.idamToken = idamToken;
    this.serviceToken = serviceToken;
    this.payload = payload;
  }
}

export class InboundPayload implements PayloadInbound {
  callbackUrl!: string;
  logoutUrl: string | undefined;
  existingFlags!: InboundPayloadDetail;
  hmctsServiceId!: string;
  masterFlagCode!: string;
  correlationId!: string;
}

export class InboundPayloadDetail implements PayloadDetail {
  partyName!: string;
  roleOnCase!: string;
  details: InboundPayloadDetailCollection[] = [];
}

export class InboundPayloadDetailCollection implements PayloadCollectionItem {
  id!: string;
  value!: InboundPayloadFlagData;
}

export class InboundPayloadFlagData implements PayloadFlagData {
  name!: string;
  name_cy!: string;
  subTypeValue!: string | undefined;
  subTypeValue_cy!: string | undefined;
  subTypeKey!: string | undefined;
  otherDescription!: string | undefined;
  otherDescription_cy!: string | undefined;
  flagComment!: string | undefined;
  flagComment_cy!: string | undefined;
  flagUpdateComment!: string | undefined;
  dateTimeModified!: string;
  dateTimeCreated!: string;
  path!: InboundPayloadFlagPath[];
  hearingRelevant!: PayloadYesNo;
  flagCode!: string;
  status: string | undefined;
  availableExternally!: PayloadYesNo;
}

export class InboundPayloadFlagPath implements PayloadPath {
  id!: string;
  name!: string;
}
