export interface PayloadYesNo {
  [index: number]: string;
}

export interface PayloadBase {
  serviceId: string;
  serviceToken: string;
  idamToken: string;
  masterFlagCode: string;
  correlationId: string;
}

export interface PayloadInbound extends PayloadBase {
  language: string;
  callbackUrl: string;
  logoutUrl: string;
  existingFlags: PayloadDetail;
}

export interface PayloadOutbound extends PayloadBase {
  error: string;
  flagAsSupplied: PayloadDetail;
  replacementFlags: PayloadDetail;
}

export interface PayloadDetail {
  partyName: string;
  roleOnCase: string;
  details: PayloadCollectionItem[];
}

export interface PayloadCollectionItem {
  id: string;
  value: PayloadFlagData;
}

export interface PayloadPath {
  id: string | undefined;
  name: string;
}

export interface PayloadFlagData {
  name: string;
  name_cy: string;
  subTypeValue: string | undefined;
  subTypeValue_cy: string | undefined;
  subTypeKey: string | undefined;
  otherDescription: string | undefined;
  otherDescription_cy: string | undefined;
  flagComment: string | undefined;
  flagComment_cy: string | undefined;
  flagUpdateComment: string | undefined;
  dateTimeModified: string;
  dateTimeCreated: string;
  path: PayloadPath[];
  hearingRelevant: PayloadYesNo;
  flagCode: string;
  status: string | undefined;
  availableExternally: PayloadYesNo;
}
