export interface ReferenceDataFlagType {
  name: string;
  name_cy: string;
  hearingRelevant: boolean;
  flagComment: boolean;
  defaultStatus: string | undefined;
  externallyAvailable: boolean;
  flagCode: string;
  nativeFlagCode: string;
  isParent: boolean;
  // Note: property is deliberately spelt "Path" and not "path" because the Reference Data Common API returns the former
  Path: string[];
  childFlags: ReferenceDataFlagType[];
  listOfValuesLength: number;
  listOfValues: { key: string; value: string; value_cy: string | undefined }[];
}

export interface FlagResourceType {
  [index: number]: string;
}

export interface ReferenceData {
  getFlags(
    serviceToken: string,
    accessToken: string,
    serviceId: string,
    flagType: FlagResourceType,
    welsh: boolean
  ): Promise<ReferenceDataResponse>;
}

export interface ReferenceDataResponseDetail {
  FlagDetails?: ReferenceDataFlagType[];
}

export interface ReferenceDataResponse {
  flags: ReferenceDataResponseDetail[];
}
