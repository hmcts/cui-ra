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
  existingFlags!: MainPayloadDetail;
  hmctsServiceId!: string;
  masterFlagCode!: string;
  correlationId!: string;
  language!: string;
}

export class MainPayloadDetail implements PayloadDetail {
  partyName!: string;
  roleOnCase!: string;
  details: MainPayloadDetailCollection[] = [];
}

export class MainPayloadDetailCollection implements PayloadCollectionItem {
  id!: string;
  value!: MainPayloadFlagData;
}

export class MainPayloadFlagData implements PayloadFlagData {
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
  path!: MainPayloadFlagPath[];
  hearingRelevant!: PayloadYesNo;
  flagCode!: string;
  status: string | undefined;
  availableExternally!: PayloadYesNo;
}

export class MainPayloadFlagPath implements PayloadPath {
  id!: string;
  name!: string;
}

export class OutboundPayload {
  flagsAsSupplied: MainPayloadDetail | undefined;
  replacementFlags: MainPayloadDetail | undefined;
}
